import {
  Avatar,
  Box,
  CloseButton,
  Icon,
  Input,
  Text,
  useToast
} from '@chakra-ui/react';
import { GallaryAddIcon } from '../../assets/svgs';
import React, { useRef, useState } from 'react';
import { convertJSTOBase64 } from '../../services/algorand.service';

interface ImageUploadControlProps {
  onImageChange: (data: string | null) => void;
  image?: string;
}

export default function ImageUploadControl(props: ImageUploadControlProps) {
  const { onImageChange, image } = props;
  const [imgSrc, setImgSrc] = useState('');
  const [file, setFile] = useState<string | null>(null);
  const toast = useToast();

  const fileRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = () => {
    fileRef?.current?.click();
  };

  const handleFileSelect = async (event: React.FormEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;

    setFile(event.currentTarget.value);
    if (files && files?.length > 0) {
      const _file = files?.[0];
      if (_file.size > 50000) {
        toast({
          description: 'Maximum size to upload image is 50kb!',
          duration: 3000,
          isClosable: true,
          position: 'top',
          status: 'error'
        });
        setFile(null);
        return;
      }
      const bytesArr = await getAsByteArray(_file);
      const base64Str = convertJSTOBase64(bytesArr);
      onImageChange(base64Str);
      setImgSrc(base64Str);
    }
  };

  const readFile = (file: File) => {
    return new Promise((resolve, reject) => {
      // Create file reader
      let reader = new FileReader();
      // Register event listeners
      reader.addEventListener('loadend', (e: ProgressEvent<FileReader>) => {
        // console.log('ArrayBugger', e.target?.result);
        resolve(e?.target?.result);
      });
      reader.addEventListener('error', reject);

      // Read file
      reader.readAsArrayBuffer(file);
    });
  };

  const getAsByteArray = async (file: File) => {
    const reader: any = await readFile(file);
    return new Uint8Array(reader);
  };

  const handleRemoveImg = (event: React.FormEvent<HTMLButtonElement>) => {
    event?.stopPropagation();
    setImgSrc('');
    setFile(null);
    onImageChange(null);
  };

  React.useEffect(() => {
    if (image) {
      setImgSrc(image);
    }
  }, [image]);

  return (
    <Box
      w={'100%'}
      border="2px lightblue dashed"
      p={5}
      borderRadius={'2xl'}
      textAlign={'center'}
      cursor={'pointer'}
      onClick={handleSelectFile}
    >
      {imgSrc ? (
        <Box width={'fit-content'} margin="0 auto" position={'relative'}>
          <Avatar
            name="xyz"
            src={`data:image/png;base64, ${imgSrc}`}
            height={45}
          />
          <CloseButton
            size={'sm'}
            borderRadius={'full'}
            backgroundColor={'blue.500'}
            position={'absolute'}
            color="#fff"
            fontWeight={600}
            fontSize={8}
            top={-2}
            right={-3}
            onClick={handleRemoveImg}
          />
        </Box>
      ) : (
        <Icon as={GallaryAddIcon} h={45} w={45} />
      )}

      <Text mt={2}>Upload your channel Logo (Max. size 50kb)</Text>
      <Text mt={2}>Allowed: PNG, JPEG</Text>
      <Input
        onChange={handleFileSelect}
        ref={fileRef}
        type="file"
        accept='image/png, image/jpeg'
        value-={file}
        display={'none'}
      />
    </Box>
  );
}

import { Avatar, Box, CloseButton, Icon, Input, Text } from '@chakra-ui/react';
import { GallaryAddIcon } from '../../assets/svgs';
import React, { useRef, useState } from 'react';

interface ImageUploadControlProps {
  onImageChange: (data: Uint8Array | null) => void;
}

export default function ImageUploadControl(props: ImageUploadControlProps) {
  const { onImageChange } = props
  const [imgSrc, setImgSrc] = useState('')

  const fileRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = () => {
    fileRef?.current?.click();
  };

  const handleFileSelect = async (event: React.FormEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget
    console.log('files', files?.[0])

    if (files && files?.length > 0) {
      const bytesArr = await getAsByteArray(files?.[0])
      onImageChange(bytesArr)
      const blob = new Blob([bytesArr], { type: "image/jpeg" });
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(blob);
      setImgSrc(imageUrl);
    }
  }

  const readFile = (file: File) => {
    return new Promise((resolve, reject) => {
      // Create file reader
      let reader = new FileReader()
      // Register event listeners
      reader.addEventListener("loadend", (e: ProgressEvent<FileReader>) => {
        console.log('ArrayBugger', e.target?.result)
        resolve(e?.target?.result)
      })
      reader.addEventListener("error", reject)

      // Read file
      reader.readAsArrayBuffer(file)
    })
  }

  const getAsByteArray = async (file: File) => {
    const reader: any = await readFile(file)
    return new Uint8Array(reader)
  }

  const handleRemoveImg = (event: React.FormEvent<HTMLButtonElement>) => {
    event?.stopPropagation()
    setImgSrc('')
    onImageChange(null)
  }

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

      {imgSrc ?
        <Box width={'fit-content'} margin='0 auto' position={'relative'}>
          <Avatar name='xyz' src={imgSrc} height={45} />
          <CloseButton
            size={'sm'}
            borderRadius={'full'}
            backgroundColor={'blue.500'}
            position={'absolute'}
            color='#fff'
            fontWeight={600}
            fontSize={8}
            top={-2}
            right={-3}
            onClick={handleRemoveImg}
          />
        </Box> :
        <Icon as={GallaryAddIcon} h={45} w={45} />
      }

      <Text mt={2}>Upload your channel Logo</Text>
      <Input
        onChange={handleFileSelect}
        ref={fileRef}
        type="file"
        display={'none'}
      />
    </Box>
  );
}

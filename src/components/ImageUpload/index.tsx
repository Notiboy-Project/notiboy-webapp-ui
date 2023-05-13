import { Box, Icon, Input, Text } from '@chakra-ui/react';
import { GallaryAddIcon } from '../../assets/svgs';
import { useRef, useState } from 'react';

export default function ImageUploadControl(props: any) {
  const [files, setFiles] = useState<FileList | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = () => {
    fileRef?.current?.click();
  };

  console.log('files', files);

  return (
    <Box
      w={'100%'}
      border="2px blue dashed"
      p={5}
      borderRadius={'2xl'}
      textAlign={'center'}
      cursor={'pointer'}
      onClick={handleSelectFile}
    >
      <Icon as={GallaryAddIcon} h={45} w={45} />
      <Text>Upload your channel Logo</Text>
      <Input
        onChange={(e) => {
          setFiles(e.target.files);
        }}
        ref={fileRef}
        type="file"
        display={'none'}
      />
    </Box>
  );
}

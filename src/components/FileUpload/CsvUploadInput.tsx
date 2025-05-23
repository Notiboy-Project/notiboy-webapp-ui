import { useRef, useState } from 'react';
import {
  Box,
  CloseButton,
  Icon,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { FaFileCsv } from 'react-icons/fa';

interface CsvUploadInputProps {
  onDataReceived: (data: string[]) => void;
}

export default function CsvUploadInput(props: CsvUploadInputProps) {
  const { onDataReceived } = props;

  const csvFileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [showControl, setShowControl] = useState(true);

  const handleChangeFile = (event: React.FormEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files && files.length > 0) {
      const _file = files[0];
      setFileName(_file.name);
      const reader = new FileReader();
      reader.readAsText(_file);
      reader.onloadend = (event) => {
        const csvData = event?.target?.result || ('' as string);
        if (typeof csvData === 'string') {
          const rowData = csvData?.split('\n').filter((row) => row);
          onDataReceived(rowData || []);
        }
      };
    }
  };

  const resetFileControl = () => {
    // TODO: Reset file control
    setFileName('');
    onDataReceived([]);
    setShowControl(false);
    setTimeout(() => {
      setShowControl(true);
    }, 500);
  };

  return (
    <Box>
      <InputGroup size="md">
        <Input
          placeholder="Upload CSV *"
          backgroundColor={'gray.800'}
          name="csv_file"
          size={'lg'}
          borderRadius={'xl'}
          p={'25px'}
          cursor={'pointer'}
          readOnly
          value={fileName}
          onClick={() => csvFileRef?.current?.click()}
          fontWeight={500}
          mt={4}
        />
        <InputRightElement width="5.5rem" top={5}>
          {fileName && <CloseButton mr={3} onClick={resetFileControl} />}
          <Icon
            h="1.75rem"
            fill="blue.600"
            as={FaFileCsv}
            cursor={'pointer'}
            onClick={() => csvFileRef?.current?.click()}
          />
        </InputRightElement>
      </InputGroup>
      {showControl && (
        <Input
          onChange={handleChangeFile}
          ref={csvFileRef}
          type="file"
          name="csv_file"
          display={'none'}
          accept="text/csv"
        />
      )}
    </Box>
  );
}

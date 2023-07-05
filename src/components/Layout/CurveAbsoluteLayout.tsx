import { Box, useColorMode } from '@chakra-ui/react';

export default function CurveAbsoluteLayout() {

  const { colorMode } = useColorMode()

  const isDark = colorMode === 'dark'

  return (
    <Box
      height={94}
      width={65}
      backgroundColor={'gray.700'}
      position={'relative'}
    >
      <Box
        position={'absolute'}
        top={-4}
        backgroundColor={isDark ? 'gray.800': '#fff'}
        left={-1}
        borderBottomRightRadius={15}
        height={8}
        width={10}
      />
      <Box
        position={'absolute'}
        bottom={-4}
        backgroundColor={isDark ? 'gray.800': '#fff'}
        left={-1}
        borderTopRightRadius={15}
        height={8}
        width={10}
      />      
    </Box>
  );
}

import { addSeconds, lightFormat } from 'date-fns';
import React from 'react';
import { Text } from '@chakra-ui/react';
import { TextProps } from '@chakra-ui/layout/dist/types/text';

export const TimeDisplay = (
  props: {
    secondsRemaining: number;
  } & TextProps,
) => {
  const date = addSeconds(new Date(2000, 1, 1), props.secondsRemaining);

  const showHours = props.secondsRemaining >= 60 * 60;

  const format = showHours ? 'h:mm:ss' : 'mm:ss';
  const size = showHours ? '5xl' : '7xl';

  return <Text
    {...props}
    position="absolute"
    fontSize={size}
    marginTop="-10px"
    p="0"
    fontFamily={'cursive'}
    fontWeight={'bold'}
  >
    {lightFormat(date, format)}
  </Text>;
};

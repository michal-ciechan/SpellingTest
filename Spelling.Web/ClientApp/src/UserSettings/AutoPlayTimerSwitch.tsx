import { HStack, Switch, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

export const AutoPlayTimerSwitch = (props: {
  text: string;
  isChecked: boolean;
  onChange: (x: boolean) => void;
}) => {
  const { text, onChange, isChecked } = props;

  return (
    <HStack spacing={8}>
      <Text
        verticalAlign={'middle'}
        fontFamily={'cursive'}
        fontSize={20}
        w="300px"
      >
        {text}
      </Text>
      <Switch
        size="lg"
        onChange={(x) => onChange(x.target.checked)}
        isChecked={isChecked}
      />
    </HStack>
  );
};

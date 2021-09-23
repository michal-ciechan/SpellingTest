import {
  HStack,
  Icon,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';

const UserNumberInput = (props: {
  value: number;
  onChange: (x: number) => void;
  children?: ReactNode;
  colour?: string;
}) => {
  const { value, onChange, children, colour } = props;

  return (
    <InputGroup>
      <HStack>
        <NumberInput
          size="md"
          maxW={32}
          value={value}
          onChange={(x, y) => onChange(y)}
          min={1}
          max={999999}
          step={value === 1 ? 4 : 5}
          clampValueOnBlur={true}
          color={colour}
        >
          <HStack>
            <InputLeftElement
              alignSelf={'center'}
              pointerEvents={'none'}
              marginTop={1.2}
              paddingLeft={2}
              children={children}
            />
            <NumberInputField
              alignSelf="center"
              textAlign="center"
              fontSize={20}
              padding={5}
              color={colour}
              fontFamily={'cursive'}
              fontWeight={'bold'}
            />
          </HStack>
          <NumberInputStepper>
            <NumberIncrementStepper color={colour} />
            <NumberDecrementStepper color={colour} />
          </NumberInputStepper>
        </NumberInput>
      </HStack>
    </InputGroup>
  );
};

export default UserNumberInput;

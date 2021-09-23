import {
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Tooltip,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaPlusCircle } from 'react-icons/fa';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  taskInputIsActiveState,
  taskInputIsFocusedState,
  taskInputValueState,
} from '../RecoilAtoms';

export const TaskInput = () => {
  const [isInputFocused, setTaskInputIsFocused] = useRecoilState(taskInputIsFocusedState);

  const [taskInputHasValue, setTaskInputHasValue] =
    useRecoilState(taskInputValueState);

  const isTaskInputActive = useRecoilValue(taskInputIsActiveState);

  function inputIsFocused() {
    setTaskInputIsFocused(true);
  }

  function inputIsBlurred() {
    setTaskInputIsFocused(false);
  }

  function checkValueState(x: React.ChangeEvent<HTMLInputElement>) {
    if (x.target.value != '') {
      setTaskInputHasValue(true);
    } else {
      setTaskInputHasValue(false);
    }
  }

  const colour = isTaskInputActive ? 'whiteAlpha.900' : 'whiteAlpha.400';

  return (
    <InputGroup
      onFocus={() => inputIsFocused()}
      onBlur={() => inputIsBlurred()}
    >
      <Input
        variant="flushed"
        placeholder={'Add Task'}
        _placeholder={{
          // color: isInputFocused ? 'red.500' : 'blue.500',
          opacity: isTaskInputActive ? 0 : 1,
          transition: 'opacity 0.5s',
        }}
        fontFamily={'cursive'}
        fontWeight={'bold'}
        textAlign={'center'}
        pr={50}
        onChange={(x) => checkValueState(x)}
      />
      <InputLeftElement
        children={
          <motion.div
            transition={{ duration: 0.5 }}
            style={{
              marginLeft: isTaskInputActive ? 0 : 160,
              textAlign: 'center',
              height: 19,
            }}
            layout={true}
          >
            <IconButton
              aria-label={'Add Task'}
              color={colour}
              variant={'link'}
              minWidth={0}
              _hover={{
                color: 'green.600',
              }}
              icon={<Icon fontSize={19} as={FaPlusCircle} />}
            />
          </motion.div>
        }
      />
      <Tooltip label={'Number of work sessions estimated for this task '}>
        <InputRightElement alignSelf={'center'} width="4.0rem">
          <NumberInput
            size="sm"
            maxW={20}
            defaultValue={1}
            min={1}
            border={'none'}
            visibility={isTaskInputActive ? 'visible' : 'hidden'}
          >
            <NumberInputField
              alignSelf="center"
              textAlign="center"
              border="none"
              color={colour}
            />
            <NumberInputStepper border={'none'}>
              <NumberIncrementStepper
                border={'none'}
                color={colour}
              />
              <NumberDecrementStepper
                border={'none'}
                color={colour}
              />
            </NumberInputStepper>
          </NumberInput>
        </InputRightElement>
      </Tooltip>
    </InputGroup>
  );
};

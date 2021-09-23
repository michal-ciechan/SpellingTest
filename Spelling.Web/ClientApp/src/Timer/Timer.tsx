import React, { useState } from 'react';
import {
  Box,
  BoxProps,
  Center,
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Icon,
  IconButton,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react';
import { FaPause, FaPlay, FaUsers } from 'react-icons/fa';
import { MdReplay } from 'react-icons/md';
import { CgCoffee } from 'react-icons/cg';
import { ImBook } from 'react-icons/Im';
import { IoFastFood } from 'react-icons/io5';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  selectedTimeEnumState,
  selectedTimeState,
  taskInputIsFocusedState,
  TimeStatesEnum,
} from '../RecoilAtoms';
import UserSettingsPanel from '../UserSettings/UserSettings';
import { useTimerReducer } from './UseTimerReducer';
import { TimeDisplay } from './TimeDisplay';
import { showSessionState } from '../Session/SessionInfo';
import { motion } from 'framer-motion';
import { TaskInput } from './TaskInput';

export const MotionBox = motion<BoxProps>(Box);

const Timer = () => {
  const setSelectedTimeEnum = useSetRecoilState(selectedTimeEnumState);
  const { colour: selectedColour } = useRecoilValue(selectedTimeState);

  const { state, dispatch } = useTimerReducer();

  const [showSession, setShowSession] = useRecoilState(showSessionState);

  const {
    msTotal,
    msRemainingInput,
    msRemainingOutput,
    isAnimating,
    isActive,
  } = state;

  const showResetButton = msRemainingInput != msTotal && !isAnimating;

  function switchSelectedMsTotal(selectedTimeEnum: TimeStatesEnum) {
    setSelectedTimeEnum(selectedTimeEnum);
  }

  function togglePlayPause() {
    if (isActive) pause();
    else play();
  }

  function play() {
    dispatch({ type: 'play' });
  }

  function pause() {
    dispatch({ type: 'pause' });
  }

  function reset() {
    dispatch({ type: 'reset' });
  }

  return (
    <div>
      <Stack>
        <HStack justify={'center'}>
          <IconButton
            borderRadius={'md'}
            colorScheme={'green'}
            aria-label={'WorkTime'}
            icon={<Icon fontSize={20} as={ImBook} />}
            onClick={() => switchSelectedMsTotal(TimeStatesEnum.Work)}
          />
          <IconButton
            borderRadius={'md'}
            colorScheme={'orange'}
            aria-label={'ShortBreak'}
            icon={<Icon fontSize={23} as={CgCoffee} />}
            onClick={() => switchSelectedMsTotal(TimeStatesEnum.ShortBreak)}
          />
          <IconButton
            borderRadius={'md'}
            colorScheme={'red'}
            aria-label={'LongBreak'}
            icon={<Icon fontSize={21} as={IoFastFood} />}
            onClick={() => switchSelectedMsTotal(TimeStatesEnum.LongBreak)}
          />
          <UserSettingsPanel />
          <IconButton
            variant={showSession ? 'solid' : 'outline'}
            borderRadius={'md'}
            colorScheme={'blue'}
            aria-label={'Session'}
            icon={<Icon fontSize={21} as={FaUsers} />}
            onClick={() => setShowSession(!showSession)}
          />
        </HStack>
        <StackDivider />
        <CircularProgress
          value={msRemainingOutput < 1000 ? 0 : msRemainingOutput}
          max={msTotal}
          color={selectedColour + '.500'}
          size="80"
        >
          <CircularProgressLabel>
            <Center w="80" h="80" position="absolute" marginTop="-40">
              <IconButton
                _hover={{ color: 'red.600' }}
                visibility={showResetButton ? 'visible' : 'hidden'}
                position="absolute"
                color="red.500"
                aria-label="Reset"
                variant="link"
                mt="-36"
                onClick={reset}
                fontSize="50"
                icon={<Icon as={MdReplay} />}
              />
              <TimeDisplay
                secondsRemaining={msRemainingOutput / 1000}
                color={selectedColour + '.500'}
              />
              <IconButton
                _hover={{
                  color: isActive ? 'red.600' : selectedColour + '.600',
                }}
                position="absolute"
                color={isActive ? 'red.500' : selectedColour + '.500'}
                aria-label="Play"
                variant="link"
                mt="36"
                onClick={togglePlayPause}
                fontSize="40"
                icon={<Icon as={isActive ? FaPause : FaPlay} />}
              />
            </Center>
          </CircularProgressLabel>
        </CircularProgress>
        <TaskInput />
      </Stack>
    </div>
  );
};

export default Timer;

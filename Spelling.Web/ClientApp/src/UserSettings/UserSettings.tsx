import { useRecoilState } from 'recoil';
import {
  Heading,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  StackDivider,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { IoFastFood, IoSettingsSharp } from 'react-icons/io5';
import { CgCoffee } from 'react-icons/cg';
import { ImBook } from 'react-icons/Im';
import { longBreakState, shortBreakState, workState } from '../RecoilAtoms';
import UserNumberInput from '../Timer/UserNumberInput';
import { alarmVolumeState } from '../Timer/alarms/Alarm';
import UserPredefinedTimerSettings from '../Timer/UserPredefinedTimerSettings';
import { AutoPlayTimerSettings } from './AutoPlayTimerSettings';

const AlarmSettings = () => {
  var [volume, setVolume] = useRecoilState(alarmVolumeState);

  return (
    <>
      <Heading as="h1" size="md" isTruncated>
        Alarm Volume
      </Heading>
      <Slider
        aria-label="slider-ex-1"
        defaultValue={volume}
        min={0}
        max={1}
        step={0.01}
        colorScheme="green"
        onChange={setVolume}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </>
  );
};

const UserSettingsPanel = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [workTime, setWorkTime] = useRecoilState(workState);
  const [shortBreakTime, setShortBreakTime] = useRecoilState(shortBreakState);
  const [longBreakTime, setLongBreakTime] = useRecoilState(longBreakState);

  return (
    <>
      <IconButton
        aria-label={'Settings'}
        borderRadius={'md'}
        icon={<Icon fontSize={22} as={IoSettingsSharp} />}
        onClick={onOpen}
      />
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            alignSelf={'center'}
            fontFamily={'cursive'}
            fontWeight={'bold'}
          >
            User Settings
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <UserPredefinedTimerSettings />
              <StackDivider />
              <HStack>
                <UserNumberInput
                  value={workTime.minutes}
                  onChange={(x) => setWorkTime({ ...workTime, minutes: x })}
                  children={
                    <Icon fontSize={18} color={'green.500'} as={ImBook} />
                  }
                  colour={'green.500'}
                />
                <UserNumberInput
                  value={shortBreakTime.minutes}
                  onChange={(x) =>
                    setShortBreakTime({ ...shortBreakTime, minutes: x })
                  }
                  children={
                    <Icon fontSize={20} color={'orange.500'} as={CgCoffee} />
                  }
                  colour={'orange.500'}
                />
                <UserNumberInput
                  value={longBreakTime.minutes}
                  onChange={(x) =>
                    setLongBreakTime({ ...longBreakTime, minutes: x })
                  }
                  children={
                    <Icon fontSize={20} color={'red.500'} as={IoFastFood} />
                  }
                  colour={'red.500'}
                />
              </HStack>
              <StackDivider />
              <AutoPlayTimerSettings />
              <StackDivider/>
              <AlarmSettings />
            </Stack>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserSettingsPanel;

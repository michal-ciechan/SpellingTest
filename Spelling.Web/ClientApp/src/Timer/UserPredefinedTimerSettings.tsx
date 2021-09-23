import { HStack, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { useRecoilState } from 'recoil';
import { longBreakState, shortBreakState, workState } from '../RecoilAtoms';
import {
  BsBriefcaseFill,
  BsStopwatch,
  GiTomato,
  TiWaves,
} from 'react-icons/all';

const UserPredefinedTimerSettingIconButton = (props: {
  workPredefinedTime: number;
  shortBreakPredefinedTime: number;
  longBreakPredefinedTime: number;
  icon?: ReactElement | undefined;
  colour?: string;
  tooltip: React.ReactNode;
}) => {
  const {
    icon,
    colour,
    workPredefinedTime,
    shortBreakPredefinedTime,
    longBreakPredefinedTime,
    tooltip,
  } = props;

  const [workTime, setWorkTime] = useRecoilState(workState);
  const [shortBreakTime, setShortBreakTime] = useRecoilState(shortBreakState);
  const [longBreakTime, setLongBreakTime] = useRecoilState(longBreakState);

  function setPredefined(
    workPredefinedTime: number,
    shortBreakPredefinedTime: number,
    longBreakPredefinedTime: number,
  ) {
    setWorkTime({ ...workTime, minutes: workPredefinedTime });
    setShortBreakTime({ ...shortBreakTime, minutes: shortBreakPredefinedTime });
    setLongBreakTime({ ...longBreakTime, minutes: longBreakPredefinedTime });
  }

  return (
    <Tooltip label={tooltip} fontSize="md">
      <IconButton
        borderRadius={'md'}
        aria-label={'PredefinedSettings'}
        icon={icon}
        colorScheme={colour}
        onClick={() =>
          setPredefined(
            workPredefinedTime,
            shortBreakPredefinedTime,
            longBreakPredefinedTime,
          )
        }
      />
    </Tooltip>
  );
};

const UserPredefinedTimerSettings = () => {
  return (
    <HStack spacing={4} justifyContent={'center'}>
      <UserPredefinedTimerSettingIconButton
        workPredefinedTime={15}
        shortBreakPredefinedTime={5}
        longBreakPredefinedTime={10}
        icon={<Icon fontSize={22} as={BsStopwatch} />}
        colour={'orange'}
        tooltip={'Short'}
      />
      <UserPredefinedTimerSettingIconButton
        workPredefinedTime={25}
        shortBreakPredefinedTime={5}
        longBreakPredefinedTime={15}
        icon={<Icon fontSize={22} as={GiTomato} />}
        colour={'red'}
        tooltip={'Pomodoro'}
      />
      <UserPredefinedTimerSettingIconButton
        workPredefinedTime={50}
        shortBreakPredefinedTime={5}
        longBreakPredefinedTime={60}
        icon={<Icon fontSize={22} as={BsBriefcaseFill} />}
        colour={'blue'}
        tooltip={'Work'}
      />
      <UserPredefinedTimerSettingIconButton
        workPredefinedTime={90}
        shortBreakPredefinedTime={15}
        longBreakPredefinedTime={75}
        icon={<Icon fontSize={22} as={TiWaves} />}
        colour={'green'}
        tooltip={'Natural'}
      />
    </HStack>
  );
};

export default UserPredefinedTimerSettings;

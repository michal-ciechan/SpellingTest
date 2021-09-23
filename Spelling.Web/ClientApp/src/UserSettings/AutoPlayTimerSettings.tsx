import { VStack } from '@chakra-ui/react';
import React from 'react';
import { AutoPlayTimerSwitch } from './AutoPlayTimerSwitch';
import { useRecoilState } from 'recoil';
import {
  autoPlayLongBreakState,
  autoPlayShortBreakState,
  autoPlayWorkState,
  workState,
} from '../RecoilAtoms';

export const AutoPlayTimerSettings = () => {
  const [autoPlayShortBreak, setAutoPlayShortBreak] = useRecoilState(
    autoPlayShortBreakState,
  );

  const [autoPlayWork, setAutoPlayWorkState] =
    useRecoilState(autoPlayWorkState);

  const [autoPlayLongBreak, setAutoPlayLongBreakState] = useRecoilState(
    autoPlayLongBreakState,
  );

  return (
    <VStack align={'stretch'}>
      <AutoPlayTimerSwitch
        text={'Auto Play Work Timer'}
        isChecked={autoPlayWork}
        onChange={setAutoPlayWorkState}
      />
      <AutoPlayTimerSwitch
        text={'Auto Play Short Break Timer'}
        isChecked={autoPlayShortBreak}
        onChange={setAutoPlayShortBreak}
      />
      <AutoPlayTimerSwitch
        text={'Auto Play Long Break Timer'}
        isChecked={autoPlayLongBreak}
        onChange={setAutoPlayLongBreakState}
      />
    </VStack>
  );
};

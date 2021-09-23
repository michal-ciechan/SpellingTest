import { atom, selector, useRecoilCallback, useSetRecoilState } from 'recoil';

export enum TimeStatesEnum {
  Work,
  ShortBreak,
  LongBreak,
}

export const playAlarmState = atom({
  key: 'playAlarmState',
  default: false,
});

export const workState = atom({
  key: 'workState',
  default: { minutes: 25, colour: 'green' },
});

export const shortBreakState = atom({
  key: 'shortBreakState',
  default: { minutes: 5, colour: 'orange' },
});

export const longBreakState = atom({
  key: 'longBreakState',
  default: { minutes: 15, colour: 'red' },
});

export const selectedTimeEnumState = atom({
  key: 'selectedTimeEnumState',
  default: TimeStatesEnum.Work,
});

export const autoPlayShortBreakState = atom({
  key: 'autoPlayShortBreakState',
  default: false,
});

export const autoPlayWorkState = atom({
  key: 'autoPlayWorkState',
  default: false,
});

export const autoPlayLongBreakState = atom({
  key: 'autoPlayLongBreakState',
  default: false,
});

export const selectedTimeState = selector({
  key: 'selectedTimeState',
  get: ({ get }) => {
    const selectedState = get(selectedTimeEnumState);

    switch (selectedState) {
      case TimeStatesEnum.Work:
        return get(workState);
      case TimeStatesEnum.ShortBreak:
        return get(shortBreakState);
      case TimeStatesEnum.LongBreak:
        return get(longBreakState);
      default:
        return get(workState);
    }
  },
});

export const taskInputIsFocusedState = atom({
  key: 'taskInputIsFocusedState',
  default: false,
});

export const taskInputValueState = atom({
  key: 'taskInputValueState',
  default: false,
});

export const taskInputIsActiveState = selector({
  key: 'taskInputIsActiveState',
  get: ({ get }) => {
    const isFocusedState = get(taskInputIsFocusedState);
    const isInputValueState = get(taskInputValueState);

    if (isFocusedState || isInputValueState)
      return true;

    return false;
  },
});

export const useOnIntervalFinishedAction = () => {
  const setSelectedTimeEnum = useSetRecoilState(selectedTimeEnumState);
  const setPlayAlarm = useSetRecoilState(playAlarmState);

  return useRecoilCallback(
    ({ snapshot }) =>
      () => {
        const selectedTime = snapshot
          .getLoadable(selectedTimeEnumState)
          .valueOrThrow();

        setPlayAlarm(true);

        switch (selectedTime) {
          case TimeStatesEnum.Work:
            setSelectedTimeEnum(TimeStatesEnum.ShortBreak);
            break;
          default:
            setSelectedTimeEnum(TimeStatesEnum.Work);
            break;
        }
      },
    [],
  );
};

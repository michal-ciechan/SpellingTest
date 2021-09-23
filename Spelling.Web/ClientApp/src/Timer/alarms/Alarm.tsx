import React, { useEffect } from 'react';

// @ts-ignore
import alarmClock from './AlarmClockShort.mp3';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { playAlarmState } from '../../RecoilAtoms';

export const alarmTimeMsState = atom({
  key: 'alarmTimeMs',
  default: 5 * 1000,
});

export const alarmVolumeState = atom({
  key: 'alarmVolume',
  default: 0.5,
});

const audio =  new Audio(alarmClock);

audio.loop = true;

export const Alarm = () => {
  const [play, setPlay] = useRecoilState(playAlarmState);
  const alarmTimeMs = useRecoilValue(alarmTimeMsState);
  const volume = useRecoilValue(alarmVolumeState);

  useEffect(() => {
    audio.volume = volume;
  }, [volume])

  useEffect(() => {
    if (play) {
      audio.play();

      const timeoutId = setTimeout(() => {
        setPlay(false);
        audio.pause();
        audio.currentTime = 0;
      }, alarmTimeMs);

      return () => {
        audio.pause();
        clearTimeout(timeoutId);
      }
    }
  }, [play]);

  return <></>;
};

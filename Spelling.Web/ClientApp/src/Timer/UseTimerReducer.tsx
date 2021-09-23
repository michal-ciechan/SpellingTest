import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  playAlarmState,
  autoPlayShortBreakState,
  autoPlayWorkState,
  selectedTimeState,
  useOnIntervalFinishedAction,
} from '../RecoilAtoms';
import { useCallback, useEffect, useState } from 'react';
import { MotionValue, useSpring } from 'framer-motion';
import { useReducer } from 'reinspect';

const nowMs = () => Date.now();
type MsRemainingReducerState = {
  isActive: boolean;
  isAnimating: boolean;
  spring: MotionValue<number>;
  msTotal: number;
  msEndAt: number;
  msRemainingInput: number;
  msRemainingOutput: number;
};

type Action =
  | { type: 'animate-to'; ms: number }
  | { type: 'animation-finished' }
  | { type: 'set'; ms: number }
  | { type: 'spring-onChange'; ms: number }
  | { type: 'interval-tick'; ms: number }
  | { type: 'total-changed'; ms: number }
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'reset' }
  | { type: 'finish' };

function shouldAnimate(state: MsRemainingReducerState, ms: number) {
  return Math.abs(state.msRemainingOutput - ms) > 60_000;
}

const useMsRemainingReducer = () => {
  const onIntervalFinished = useOnIntervalFinishedAction();

  const setPlayAlarm = useSetRecoilState(playAlarmState);

  return useCallback((state: MsRemainingReducerState, action: Action) => {
    switch (action.type) {
      case 'animate-to':
        if (action.ms === state.msRemainingInput) {
          return state;
        }

        state.spring.set(action.ms);

        if (!shouldAnimate(state, action.ms)) {
          return {
            ...state,
            isAnimating: false,
            msRemainingInput: action.ms,
            msRemainingOutput: action.ms,
          };
        }

        return {
          ...state,
          msRemainingInput: action.ms,
          isAnimating: true,
        };

      case 'animation-finished':
        return {
          ...state,
          isAnimating: false,
        };

      // this is used to jump to a specific value
      case 'set':
        if (
          action.ms === state.msRemainingInput &&
          action.ms === state.msRemainingOutput &&
          !state.isAnimating
        ) {
          return state;
        }

        // We set the spring even though we are not animating,
        // so that a future animation will start from correct value.
        state.spring.set(action.ms);

        return {
          ...state,
          isAnimating: false,
          msRemainingInput: action.ms,
          msRemainingOutput: action.ms,
        };

      // this gets called by the framer MotionValue animation object while its animating
      case 'spring-onChange':
        if (!state.isAnimating) return state;

        return {
          ...state,
          msRemainingOutput: action.ms,
          isAnimating: action.ms !== state.msRemainingInput,
        };

      case 'interval-tick':
        if (state.isAnimating) return state;

        state.spring.set(action.ms);

        return {
          ...state,
          msRemainingInput: action.ms,
          msRemainingOutput: action.ms,
        };

      case 'total-changed':
        if (action.ms === state.msTotal) {
          return state;
        }

        // We set the spring even though we are not animating,
        // so that a future animation will start from correct value.
        state.spring.set(action.ms);

        return {
          ...state,
          msTotal: action.ms,
          isActive: false,
          isAnimating: true,
          msRemainingInput: action.ms,
        };

      case 'play':
        if (state.isActive) {
          return state;
        }

        setPlayAlarm(false);

        return {
          ...state,
          msEndAt: nowMs() + state.msRemainingInput,
          isActive: true,
        };

      case 'pause':
        if (!state.isActive) {
          return state;
        }

        return {
          ...state,
          isActive: false,
        };

      case 'finish':
        onIntervalFinished();

        return {
          ...state,
          isActive: false,
        };

      case 'reset':
        state.spring.set(state.msTotal);

        if (!shouldAnimate(state, state.msTotal)) {
          return {
            ...state,
            isActive: false,
            isAnimating: false,
            msRemainingInput: state.msTotal,
            msRemainingOutput: state.msTotal,
            msEndAt: nowMs() + state.msTotal,
          };
        }

        return {
          ...state,
          isActive: false,
          isAnimating: true,
          msRemainingInput: state.msTotal,
          msEndAt: nowMs() + state.msTotal,
        };
    }
  }, []);
};

export function useTimerReducer() {
  const selectedTime = useRecoilValue(selectedTimeState);
  const autoPlayShortBreak = useRecoilValue(autoPlayShortBreakState);
  const autoPlayWork = useRecoilValue(autoPlayWorkState);

  const workMsTotal = selectedTime.minutes * 60 * 1000;
  const [currentMsTotal, setCurrentMsTotal] = useState(workMsTotal);

  const msAnimatedSpring = useSpring(currentMsTotal, {
    duration: 500,
  });

  const initialState = {
    isActive: false,
    isAnimating: false,
    msTotal: workMsTotal,
    msEndAt: nowMs() + workMsTotal,
    msRemainingInput: currentMsTotal,
    msRemainingOutput: currentMsTotal,
    spring: msAnimatedSpring,
  };

  const reducer = useMsRemainingReducer();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    return msAnimatedSpring.onChange((v) => {
      dispatch({ type: 'spring-onChange', ms: v });
    });
  }, []);

  // Check if total has changed
  if (state.msTotal !== workMsTotal) {
    dispatch({ type: 'total-changed', ms: workMsTotal });
    setCurrentMsTotal(workMsTotal);
  }

  // Create the counter (-1 every second).
  useEffect(() => {
    // console.log(`${nowMs()} - Before hitting is active : ${isActive}`);
    if (state.isActive) {
      const timer = setInterval(() => {
        // console.log(`${endTime} - ${nowMs()} = ${endTime - nowMs()}`);
        const calcMsRemaining = state.msEndAt - nowMs();

        if (calcMsRemaining <= 0) {
          dispatch({ type: 'finish' });

          // CODE MONKEY GO BRRPPP, THIS NEEDS CHANGING, SEEMS TO CAUSE A FEW BUGS
          // AND THERE IS PROLLY A BETTER AND CLEANER WAY TO DO IT
          if (selectedTime.colour == 'green' && autoPlayShortBreak == true) {
            dispatch({ type: 'play' });
            return;
          }

          if (selectedTime.colour == 'orange' && autoPlayWork == true) {
            dispatch({ type: 'play' });
            return;
          }

          return;
        }

        dispatch({ type: 'interval-tick', ms: calcMsRemaining });
      }, 200);

      return () => {
        clearInterval(timer);
      };
    }
  }, [state.isActive, state.msEndAt]);

  return {
    state,
    dispatch,
  };
}

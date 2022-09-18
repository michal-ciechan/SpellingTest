import React, { useState } from 'react';
import {
  Box,
  BoxProps,
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Stack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Artyom from 'artyom.js';
import { Field, Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { ErrorBoundary } from '../Helpers/ErrorBoundary';
import { FaPlay } from 'react-icons/fa';
import { Select } from 'chakra-react-select';
import create from 'zustand';
import { proxy, ref, subscribe, useSnapshot } from 'valtio';
import { derive } from 'valtio/utils';

export const MotionBox = motion<BoxProps>(Box);

interface WordInputProps {
  number: number;
  data: WordData;
}

const artyom = new Artyom();

artyom.ArtyomVoicesIdentifiers['en-GB'] = [
  'Microsoft Mia Online (Natural) - English (United Kingdom)',
  'Microsoft Susan - English (United Kingdom)',
  'Microsoft Guy Online (Natural) - English (United States)',
  'Microsoft George - English (United Kingdom)',
  'Google UK English Female',
  'Google UK English Male',
  'en-GB',
  'en_GB',
];

artyom.initialize({ lang: 'en-GB' });

const WordInput = (props: WordInputProps) => {
  const playClick = () => {
    console.log(`Play Word ${props.data.word}`);

    window.speechSynthesis.pause();
    window.speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(props.data.word);
    console.log(store.voice.name);
    msg.lang = store.voice.lang;
    msg.voice = store.voice;

    window.speechSynthesis.speak(msg);

    const msg2 = new SpeechSynthesisUtterance('The word is ' + props.data.word);
    msg2.lang = store.voice.lang;
    msg2.voice = store.voice;

    window.speechSynthesis.speak(msg2);

    console.log(artyom.getVoices());
  };

  const name = `words[${props.number - 1}]`;

  return (
    <Field name={name}>
      {({ field, form }) => (
        <InputGroup>
          <InputLeftAddon
            children={props.number}
            width="12"
            textAlign="center"
            justifyContent="center"
          />
          <Input {...field} placeholder={`Enter Word ${props.number}`} />
          <InputRightAddon
            bgColor="green.500"
            _hover={{ bgColor: 'darkGreen' }}
            cursor="pointer"
            onClick={playClick}
          >
            <Icon fontSize={20} as={FaPlay} color="gray.800" />
          </InputRightAddon>
        </InputGroup>
      )}
    </Field>
  );
};
interface WordData {
  status?: undefined | 'success' | 'error';
  word: string;
}

const wordsData: WordData[] = [
  { word: 'Monday' },
  { word: 'Tuesday' },
  { word: 'Wednesday' },
  { word: 'Thursday' },
  { word: 'Friday' },
  { word: 'Saturday' },
  { word: 'Sunday' },
  { word: 'week' },
  { word: 'seven' },
  { word: 'I love you alexandra' },
];

interface FormValues {
  words: string[];
}

const SpellingTest = () => {
  const initialValues: FormValues = {
    words: wordsData.map(() => ''),
  };

  const snap = useSnapshot(store);

  const voices = snap.voices.map((x) => ({
    label: x.name,
    value: x,
  }));

  const selectedVoice = voices.find((x) => x.value === snap.voice);

  const onSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));

      let score = 0;

      for (let i = 0; i < values.words.length; i++) {
        const value = values.words[i];
        const wordData = wordsData[i];

        if (value === wordData.word) {
          score++;
          wordData.status = 'success';
        } else {
          wordData.status = 'error';
        }
      }

      let text = `You got ${score} out of 10`;

      if (score == 10) {
        text = 'Congratulation, ' + text;
      }

      artyom.say(text);

      actions.setSubmitting(false);
    }, 1000);
  };

  return (
    <ErrorBoundary>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(props) => (
          <Form>
            <div>
              <Stack width="400px">
                {wordsData.map((word, index) => (
                  <WordInput number={index + 1} data={word} key={index} />
                ))}
                <Button
                  size="lg"
                  height="32"
                  fontSize="6xl"
                  colorScheme="green"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  CHECK
                </Button>
              </Stack>
              <InputGroup>
                <InputLeftAddon>Voice</InputLeftAddon>

                <div style={{ width: '800px' }}>
                  <Select
                    options={voices}
                    value={selectedVoice}
                    onChange={(x) => (store.voice = x!.value)}
                  />
                </div>
              </InputGroup>
            </div>
          </Form>
        )}
      </Formik>
    </ErrorBoundary>
  );
};

const voices = window.speechSynthesis.getVoices().map((x) => ref(x));

const store = proxy({
  voices: ref(voices),
  voice: voices[0],
});

subscribe(state);
console.log('Vocie: ', store.voice);

setTimeout(() => {
  const voices = window.speechSynthesis.getVoices().map((x) => ref(x));

  store.voices = ref(voices);
  store.voice = voices[0];

  console.log('Voice: ', store.voice);
}, 5);

export default SpellingTest;

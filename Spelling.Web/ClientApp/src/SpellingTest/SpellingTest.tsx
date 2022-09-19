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

function speak(...params: string[]) {
  window.speechSynthesis.pause();
  window.speechSynthesis.cancel();

  for (const word of params) {
    const msg = new SpeechSynthesisUtterance(word);

    msg.lang = store.voice.lang;
    msg.voice = store.voice;

    window.speechSynthesis.speak(msg);
  }
}

const WordInput = (props: WordInputProps) => {
  const playClick = () => {
    const word = props.data.word;
    console.log(`Play Word ${word}`);

    console.log(store.voice.name);

    speak(word, 'The word is ' + word);
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
          <Input
            {...field}
            placeholder={`Enter Word ${props.number}`}
            autoComplete="false"
            autoCorrect="false"
          />
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
  { word: 'numbers' },
  { word: 'forwards' },
  { word: 'backwards' },
  { word: 'hundreds' },
  { word: 'Image' },
  { word: 'Digit' },
  { word: 'Sequence' },
  { word: 'Missing' },
  { word: 'Value' },
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

        if (
          value?.toLowerCase().trim() === wordData.word?.toLowerCase().trim()
        ) {
          score++;
          wordData.status = 'success';
        } else {
          wordData.status = 'error';
        }
      }

      let text = `You got ${score} out of ${wordsData.length}`;

      const percent = score / wordsData.length;

      if (score >= 1) {
        text = 'Congratulation, ' + text;
      }

      speak(text);

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

const voices = window.speechSynthesis
  .getVoices()
  .filter((x) => x.name.toLowerCase().includes('english'))
  .map((x) => ref(x));

const store = proxy({
  voices: ref(voices),
  voice: voices[0],
});

console.log('Vocie: ', store.voice);

setTimeout(() => {
  const voices = window.speechSynthesis
    .getVoices()
    .filter((x) => x.name.toLowerCase().includes('english'))
    .sort((a, b) => voiceSortValue(b) - voiceSortValue(a))
    .map((x) => ref(x));

  store.voices = ref(voices);
  store.voice = voices[0];

  console.log('Voice: ', store.voice);
}, 5);

const voiceSortValue = (x: SpeechSynthesisVoice): number => {
  let n = 0;

  const name = x.name.toLowerCase();

  if (name.includes('united kingdom')) {
    n += 100;
  } else if (name.includes('united state')) {
    n += 50;
  } else if (name.includes('australia')) {
    n += 30;
  }

  if (name.includes('natural')) {
    n += 10;
  }

  return n;
};

export default SpellingTest;

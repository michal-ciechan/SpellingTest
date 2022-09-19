import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  BoxProps,
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Stack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { ErrorBoundary } from '../Helpers/ErrorBoundary';
import { FaPlay } from 'react-icons/fa';
import { Select } from 'chakra-react-select';
import { proxy, ref, useSnapshot } from 'valtio';
import { voiceStore, voiceSortValue } from './SpeechVoicesStore';

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

    msg.lang = voiceStore.voice.lang;
    msg.voice = voiceStore.voice;

    window.speechSynthesis.speak(msg);
  }
}

const WordInput = (props: WordInputProps) => {
  const playClick = () => {
    const word = props.data.word;
    console.log(`Play Word ${word}`);

    console.log(voiceStore.voice.name);

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
            autoComplete="off"
            autoCorrect="false"
            list="autocompleteOff"
            onFocus={playClick}
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

interface FormValues {
  words: string[];
}

const SpellingTest = () => {
  const initialValues: FormValues = {
    words: wordsData.map(() => ''),
  };

  const snap = useSnapshot(voiceStore);

  const voices = snap.voices.map((x) => ({
    label: x.name,
    value: x,
  }));

  const selectedVoice = voices.find((x) => x.value === snap.voice);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    // alert(JSON.stringify(values, null, 2));

    let score = 0;

    for (let i = 0; i < values.words.length; i++) {
      const value = values.words[i];
      const wordData = wordsData[i];

      if (value?.toLowerCase().trim() === wordData.word?.toLowerCase().trim()) {
        score++;
        wordData.status = 'success';
      } else {
        wordData.status = 'error';
      }
    }

    const text = `You got ${score} out of ${wordsData.length}`;

    const percent = score / wordsData.length;

    store.score = score;
    store.scorePercent = percent;

    speak(text, alertFooterText());

    actions.setSubmitting(false);
    onOpen();
  };

  function alertFooterText() {
    if (store.scorePercent >= 1) {
      return 'Congratulations';
    }

    if (store.scorePercent >= 0.9) {
      return 'Almost!';
    }

    if (store.scorePercent >= 0.8) {
      return 'Well Done!';
    }

    if (store.scorePercent >= 0.4) {
      return 'Nice Try!';
    }

    return 'Keep Practicing!';
  }

  return (
    <ErrorBoundary>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(props) => (
          <Form autoComplete="off">
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
              <InputGroup style={{ maxWidth: '100vw' }}>
                <InputLeftAddon>Voice</InputLeftAddon>

                <div>
                  <Select
                    options={voices}
                    value={selectedVoice}
                    onChange={(x) => (voiceStore.voice = x!.value)}
                  />
                </div>
              </InputGroup>
            </div>
          </Form>
        )}
      </Formik>

      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Score
            </AlertDialogHeader>

            <AlertDialogBody>
              You got {store.score} out of {store.words.length}
            </AlertDialogBody>

            <AlertDialogFooter>{alertFooterText()}</AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </ErrorBoundary>
  );
};

const wordsData: WordData[] = [
  { word: 'numbers' },
  { word: 'forwards' },
  { word: 'backwards' },
  { word: 'hundreds' },
  { word: 'thousand' },
  { word: 'Image' },
  { word: 'Digit' },
  { word: 'Sequence' },
  { word: 'Missing' },
  { word: 'Value' },
];

const store = proxy({
  words: wordsData,
  score: 0,
  scorePercent: 0,
});

export default SpellingTest;

import React, { MutableRefObject, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Code,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import {
  Field,
  FieldInputProps,
  FieldProps,
  Form,
  Formik,
  FormikHelpers,
} from 'formik';
import { FaPlay } from 'react-icons/fa';
import { Select } from 'chakra-react-select';
import { proxy, useSnapshot } from 'valtio';
import { getVoices, voiceStore } from './SpeechVoicesStore';
import { proxyMap, proxySet } from 'valtio/utils';
import { useQuery } from 'react-query';
import { useStatefulSuspense } from '../StatefulSuspenseContext';
import { fixCircularReferences } from './FixCircularReferences';

interface WordInputProps {
  number: number;
  data: WordData;
  currentRef: MutableRefObject<HTMLInputElement | null>;
  nextRef: MutableRefObject<HTMLInputElement | null>;
}

interface WordState {
  data: WordData;
  currentState?: 'success' | 'error';
}

function speak(...params: string[]) {
  if (!voiceStore.voice) {
    throw 'No voice selected';
  }
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
  const fakeInput = useRef<HTMLInputElement | null>(null);

  const data = props.data;

  const onFocus = () => {
    const word = data.word;
    console.log(`Play Word ${word}`);

    console.log(voiceStore.voice?.name);

    speak(word, data.phrase, 'The word is ' + word);

    fakeInput.current?.focus();
  };

  const name = `words[${props.number - 1}]`;

  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => (
        <>
          <InputGroup>
            <InputLeftAddon
              children={props.number}
              width="12"
              textAlign="center"
              justifyContent="center"
              zIndex={1}
            />
            <Input // fake input
              isInvalid={data.status === 'error'}
              style={{ position: 'absolute', caretColor: 'transparent' }}
              ref={fakeInput}
              zIndex={-1}
              onKeyDown={(event) => {
                if (event.key === 'Unidentified') {
                  return;
                }

                const value = JSON.stringify(event, fixCircularReferences(), 2);
                store.items.add(value);
                console.log(event);
                console.log(value);

                if (event.key === 'Backspace') {
                  if (field.value && field.value !== '') {
                    form.setFieldValue(
                      field.name,
                      field.value.slice(0, field.value.length - 1),
                    );
                    data.status = undefined;
                  }
                }
              }}
              onChange={(event) => {
                const v = event.target.value;
                console.log(v, form, field);

                const value = JSON.stringify(event, fixCircularReferences(), 2);
                store.items.add(value);
                console.log(event);
                console.log(value);

                event.preventDefault();

                form.setFieldValue(field.name, field.value + v);
                event.target.value = '';
                data.status = undefined;
              }}
            />
            <Input
              {...field}
              isInvalid={data.status === 'error'}
              placeholder={`Enter Word ${props.number}`}
              autoComplete="off"
              autoCorrect="false"
              ref={props.currentRef}
              list="autocompleteOff"
              onFocus={onFocus}
              onChange={(event) => {
                const v = event.target.value;
                console.log(v, form, field);
                event.preventDefault();
              }}
              zIndex={1}
            />
            <InputRightAddon
              bgColor="green.500"
              _hover={{ bgColor: 'darkGreen' }}
              cursor="pointer"
              onClick={onFocus}
              zIndex={1}
            >
              <Icon fontSize={20} as={FaPlay} color="gray.800" />
            </InputRightAddon>
          </InputGroup>
        </>
      )}
    </Field>
  );
};
interface WordData {
  status?: undefined | 'success' | 'error';
  word: string;
  phrase: string;
}

interface FormValues {
  words: string[];
}

const SpellingTest = () => {
  const suspense = useStatefulSuspense();

  suspense.message = 'Loading Voices';

  const queryPromise = useQuery('voices', getVoices);

  const rawVoices = queryPromise.data;

  if (!rawVoices) {
    throw 'No Voices';
  }

  const initialValues: FormValues = {
    words: wordsData.map(() => ''),
  };

  const snap = useSnapshot(voiceStore);

  const voices = rawVoices.map((x) => ({
    label: `${x.name} (${x.lang})`,
    value: x,
  }));

  const selectedVoice = voices.find((x) => x.value === snap.voice);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const refs: MutableRefObject<HTMLInputElement | null>[] = [];

  for (let i = 0; i < 11; i++) {
    refs[i] = useRef<HTMLInputElement>(null);
  }

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

  const alertRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      style={{
        display: 'flex',
        justifyItems: 'center',
        alignItems: 'center',
      }}
    >
      <Stack>
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {(props) => (
            <Form autoComplete="off">
              <Center>
                <Stack width="95vw" maxWidth="400px">
                  <Center>
                    <Heading>Torre C of E</Heading>
                  </Center>
                  <Center>
                    <Heading>Year 3/4</Heading>
                  </Center>
                  <Center>
                    <Heading>
                      14<sup>th</sup> Oct 2022
                    </Heading>
                  </Center>
                  {wordsData.map((word, index) => (
                    <WordInput
                      number={index + 1}
                      data={word}
                      key={index}
                      currentRef={refs[index]}
                      nextRef={refs[index + 1]}
                    />
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
              </Center>
              <Stack width="800px" maxWidth="95vw">
                <Spacer />
                <Select
                  options={voices}
                  value={selectedVoice}
                  onChange={(x) => (voiceStore.voice = x!.value)}
                />
              </Stack>
            </Form>
          )}
        </Formik>
        <DebugOutput />
      </Stack>

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={alertRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Score - {new Date().toLocaleString()}
            </AlertDialogHeader>

            <AlertDialogBody>
              You got {store.score} out of {store.words.length}
            </AlertDialogBody>

            <AlertDialogFooter>{alertFooterText()}</AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

function DebugOutput() {
  if (process.env.NODE_ENV === 'production') {
    return <></>;
  }

  const state = useSnapshot(store);

  const s = [] as string[];

  state.items.forEach((x) => s.push(x));

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Debug View</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Debug View</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              {s.map((x, i) => (
                <Box borderWidth="1px" key={i}>
                  <Code>
                    <pre>{x}</pre>
                  </Code>
                </Box>
              ))}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
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

const wordsData: WordData[] = [
  { word: 'fact', phrase: 'books are often categorised into fact or fiction' },
  { word: 'summary', phrase: 'a summary is a short description of something' },
  {
    word: 'recap',
    phrase: 'could you recap the story for me?',
  },
  {
    word: 'heading',
    phrase: 'this book has an interesting heading in chapter 1',
  },
  {
    word: 'subheading',
    phrase: 'have you seen the first subheading in chapter two',
  },
  { word: 'report', phrase: 'my school report card was positive' },
  {
    word: 'diagram',
    phrase: 'i drew a diagram of my house',
  },
  {
    word: 'paragraph',
    phrase: 'did you like the last paragraph of the book?',
  },
  {
    word: 'words',
    phrase: 'there are too many words in my current book',
  },
  {
    word: 'glossary',
    phrase: 'at the back of a book, there is a glossary',
  },
];

const store = proxy({
  words: wordsData,
  score: 0,
  scorePercent: 0,
  items: proxySet([] as string[]),
});

export default SpellingTest;

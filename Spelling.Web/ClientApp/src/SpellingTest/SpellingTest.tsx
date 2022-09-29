import React, {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
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
  Center,
  Code,
  Heading,
  HStack,
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
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { ErrorBoundary } from '../Helpers/ErrorBoundary';
import { FaPlay } from 'react-icons/fa';
import { Select } from 'chakra-react-select';
import { proxy, ref, useSnapshot } from 'valtio';
import { voiceStore, voiceSortValue, getVoices } from './SpeechVoicesStore';
import { proxySet } from 'valtio/utils';
import { useQuery } from 'react-query';
import { useSuspendable } from '../Helpers/suspendable';
import { useStatefulSuspense } from '../StatefulSuspenseContext';
import { useStatefulSuspense } from '../StatefulSuspenseContext';

export const MotionBox = motion<BoxProps>(Box);

interface WordInputProps {
  number: number;
  data: WordData;
  currentRef: MutableRefObject<HTMLElement | undefined>;
  nextRef: MutableRefObject<HTMLElement | undefined>;
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
  const fakeInput = useRef<HTMLInputElement>();

  const onFocus = () => {
    const word = props.data.word;
    console.log(`Play Word ${word}`);

    console.log(voiceStore.voice?.name);

    speak(word, props.data.phrase, 'The word is ' + word);

    fakeInput.current?.focus();
  };

  const name = `words[${props.number - 1}]`;

  function fixCircularReferences() {
    const defs = {};
    return (k, v) => {
      if (typeof k === 'string') {
        if (k.startsWith('_react')) return undefined;
        if (k.startsWith('__react')) return undefined;
        if (k === 'window') return undefined;
        if (k === 'view') return undefined;
      }
      const def = defs[v];
      if (def && typeof v == 'object') return '[same as ' + def + ']';
      defs[v] = k;
      return v;
    };
  }
  return (
    <Field name={name}>
      {({ field, form }) => (
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
              }}
            />
            <Input
              {...field}
              placeholder={`Enter Word ${props.number}`}
              autoComplete="off"
              autoCorrect="false"
              ref={props.currentRef}
              list="autocompleteOff"
              onFocus={onFocus}
              onChange={(event) => {
                const v = event.target.value;

                // form.setFieldValue(field.name, v);
                console.log(v, form, field);
                event.preventDefault();
                // props.nextRef?.current?.focus();
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

  const rawVoices = queryPromise.data!;

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

  const refs: MutableRefObject<HTMLElement | undefined>[] = [];

  for (let i = 0; i < 11; i++) {
    refs[i] = useRef<HTMLElement>();
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
                      23<sup>rd</sup> Sep 2022
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
                  styles={{ width: 'auto' }}
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
  { word: 'there', phrase: 'Could you go over there' },
  { word: 'their', phrase: 'This is their toy' },
  { word: "they're", phrase: "Those kids, they're very happy" },
  { word: 'to', phrase: 'Do you need to go to the toilet' },
  { word: 'too', phrase: 'I like reading my book too' },
  { word: 'two', phrase: 'I have two apples' },
  { word: 'wait', phrase: 'We need to wait for mummy' },
  { word: 'weight', phrase: 'The weight of a pencil is not very much' },
  { word: 'whole', phrase: 'How did you eat the whole cake' },
  { word: 'hole', phrase: 'A fox run away into a hole' },
];

const store = proxy({
  words: wordsData,
  score: 0,
  scorePercent: 0,
  items: proxySet([] as string[]),
});

export default SpellingTest;

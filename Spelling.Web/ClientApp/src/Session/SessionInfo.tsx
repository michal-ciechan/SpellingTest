import React, { Suspense, useLayoutEffect } from 'react';
import { atom, useRecoilValue } from 'recoil';
import {
  Box,
  Button,
  Center,
  HStack,
  Spinner,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Card } from '../chakra-ui-pro/Card';
import { CardHeader } from '../chakra-ui-pro/CardHeader';
import { HiPencilAlt } from 'react-icons/all';
import { CardContent } from '../chakra-ui-pro/CardContent';
import {
  sessionState,
  useCreateSessionCallback,
  useJoinSessionCallback,
} from './SessionController';
import { useRouteMatch } from 'react-router-dom';

export const showSessionState = atom({
  key: 'showSessionState',
  default: false,
});

const SessionInfoInner = React.memo(() => {
  const createSession = useCreateSessionCallback();
  const joinSession = useJoinSessionCallback();
  const session = useRecoilValue(sessionState);

  const match = useRouteMatch<{ sessionId: string }>('/session/:sessionId');

  const sessionId = match?.params.sessionId;

  useLayoutEffect(() => {
    if (sessionId) {
      const id = parseInt(sessionId);
      joinSession(id);
    } else {
      createSession();
    }
  }, [sessionId]);

  const bg = useColorModeValue('gray.100', 'inherit');

  const s = session.result();

  return (
    <Box as="section" bg={bg}>
      <Card maxW="3xl" mx="auto">
        <CardHeader
          title="Session"
          // action={
          //   <Button variant="outline" minW="20" leftIcon={<HiPencilAlt />}>
          //     Invite
          //   </Button>
          // }
        />
        <CardContent>
          <Suspense
            fallback={
              <Center>
                <Spinner size="xl" />
              </Center>
            }
          >
            <Stack spacing="4">
              {s?.users.map((user) => (
                <h1 key={user.id}>{user.id}</h1>
              ))}
              <HStack spacing={4}>
                <Button variant="outline" minW="20" leftIcon={<HiPencilAlt />}>
                  Invite
                </Button>
                <Button variant="outline" minW="20" leftIcon={<HiPencilAlt />}>
                  Join
                </Button>
              </HStack>
            </Stack>
          </Suspense>
        </CardContent>
      </Card>
    </Box>
  );
});

export const SessionInfo = React.memo(() => {
  const showSessionInfo = useRecoilValue(showSessionState);

  if (!showSessionInfo) return <></>;

  return (
    <Suspense
      fallback={
        <Center>
          <Spinner size="xl" />
        </Center>
      }
    >
      <SessionInfoInner />
    </Suspense>
  );
});

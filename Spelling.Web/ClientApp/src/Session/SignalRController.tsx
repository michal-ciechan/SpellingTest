import * as signalR from '@microsoft/signalr';
import { HubConnectionState } from '@microsoft/signalr';
import React, { useEffect } from 'react';
import { selector, useRecoilValue, useSetRecoilState } from 'recoil';
import { SessionStateDo, UserJoinedDto } from '../Api/ApiClient';
import { sessionState } from './SessionController';
import { suspendable } from '../Helpers/suspendable';
import { useToast } from '@chakra-ui/react';

const signalRConnection = new signalR.HubConnectionBuilder()
  .withUrl('/api/hubs/session')
  .build();

export const signalRConnectionState = selector({
  key: 'signalRConnectionState',
  get: async () => {
    switch (signalRConnection.state) {
      case HubConnectionState.Connected:
        return () => signalRConnection;
      default:
        console.log('Connecting to SignalR');
        await signalRConnection.start();
        console.log('Connected to SignalR');

        await signalRConnection.invoke<SessionStateDo>('createSession');
        console.log('Pposted SignalR');

        return () => signalRConnection;
    }
  },
});

export const useSignalR = () => {
  return useRecoilValue(signalRConnectionState);
};

export const SignalRController = () => {
  const toast = useToast();
  const setSessionState = useSetRecoilState(sessionState);

  useEffect(() => {
    const userJoinedHandler = (args: UserJoinedDto) => {
      toast({
        title: `User Joined.`,
        description: `User ${args.user.id} has joined your session.`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });

      setSessionState(suspendable(args.sessionInfo));
    };

    signalRConnection.on('userJoined', userJoinedHandler);

    return () => {
      signalRConnection.off('userJoined', userJoinedHandler);
    };
  }, []);

  return <></>;
};

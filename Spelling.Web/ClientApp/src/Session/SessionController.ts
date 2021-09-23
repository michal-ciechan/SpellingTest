import * as signalR from '@microsoft/signalr';
import { HubConnectionState } from '@microsoft/signalr';
import { atom, selector, useRecoilCallback} from 'recoil';
import { SessionStateDo} from '../Api/ApiClient';
import { suspendable, Suspendable } from '../Helpers/suspendable';
import { useHistory } from 'react-router-dom';
import { useSignalR } from './SignalRController';


export const useCreateSessionCallback = () => {
  const history = useHistory();
  const signalR = useSignalR();

  return useRecoilCallback(
    ({ set }) =>
      () => {
        console.log(signalR);

        const session = signalR().invoke<SessionStateDo>('createSession');

        session.then(x => {
          history.push("/session/" + x.id)
        })

        set(sessionState, suspendable(session));
      },
    [],
  );
};

export const useJoinSessionCallback = () => {
  const signalR = useSignalR();

  return useRecoilCallback(
    ({ set }) =>
      (id: number) => {
        const session = signalR().invoke<SessionStateDo>('joinSession', {sessionId: id});

        set(sessionState, suspendable(session));
      },
    [],
  );
};



export const sessionState = atom<Suspendable<SessionStateDo | undefined>>({
  key: 'sessionState',
  default: {
    result: () => undefined,
  },
});

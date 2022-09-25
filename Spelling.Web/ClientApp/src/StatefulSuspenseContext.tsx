import React, { useContext, useState } from 'react';
import { Center, Spinner, Stack } from '@chakra-ui/react';
import { proxy, useSnapshot } from 'valtio';
import { voiceStore } from './SpellingTest/SpeechVoicesStore';

export type StatefulSuspenseState = {
  message?: string;
};

export type StatefulSuspenseStateStoreContext = {
  message?: string;
};

export const StatefulSuspenseContext =
  React.createContext<StatefulSuspenseStateStoreContext>({});

export function SuspenseFallback() {
  const state = useStatefulSuspense();

  const snap = useSnapshot(state);

  return (
    <Stack>
      <Center>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
      <Center>
        <h1>{snap.message || 'Loading'}</h1>
      </Center>
      <Center>
        <h2>If nothing happens try refresh or contact Jan Ciechan</h2>
      </Center>
    </Stack>
  );
}

export function StatefulSuspense(props: { children: JSX.Element }) {
  const [suspenseStore] = useState(() => proxy<StatefulSuspenseState>({}));

  return (
    <StatefulSuspenseContext.Provider value={suspenseStore}>
      <React.Suspense fallback={<SuspenseFallback />}>
        {props.children}
      </React.Suspense>
    </StatefulSuspenseContext.Provider>
  );
}

export const useStatefulSuspense = () => useContext(StatefulSuspenseContext);

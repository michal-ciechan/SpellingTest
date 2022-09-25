import React, { useContext, useState } from 'react';
import './App.css';
import {
  Center,
  ChakraProvider,
  CSSReset,
  extendTheme,
  Spinner,
  Stack,
  ThemeConfig,
} from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';
import { StateInspector } from 'reinspect';
import { Controllers } from './Controllers';
import { BrowserRouter } from 'react-router-dom';
import SpellingTest from './SpellingTest/SpellingTest';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ErrorBoundary } from './Helpers/ErrorBoundary';
import {
  StatefulSuspense,
  StatefulSuspenseContext,
  SuspenseFallback,
} from './StatefulSuspenseContext';

const appInsights = new ApplicationInsights({
  config: {
    connectionString:
      'InstrumentationKey=37071687-29ff-43ac-8b58-f738db0a7448;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/',
  },
});
appInsights.loadAppInsights();
appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

interface AppProps {}

// TODO: Move theme out into own file
// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        _focus: {
          boxShadow: 'none',
        },
      },
      variants: {
        solid: (props) => {
          if (props.colorScheme === 'gray') return {};

          return { bg: props.colorScheme + '.500' };
        },
      },
    },
  },
  config,
});

function App({}: AppProps) {
  console.debug('rendering app');

  const app = (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <StateInspector name="App">
          <RecoilRoot>
            {/*<DebugObserver />*/}
            {/*<RecoilLogger />*/}
            <ChakraProvider theme={theme}>
              <BrowserRouter>
                <CSSReset />
                <Center minHeight="100vh" padding="0.75em">
                  <ErrorBoundary>
                    <StatefulSuspense>
                      <SpellingTest />
                    </StatefulSuspense>
                  </ErrorBoundary>
                </Center>
                <Controllers />
              </BrowserRouter>
            </ChakraProvider>
          </RecoilRoot>
        </StateInspector>
      </QueryClientProvider>
    </ErrorBoundary>
  );

  const useStrictMode = import.meta.env.USE_STRICT_MODE;

  if (!useStrictMode) return app;

  console.log('Using StrictMode.');
  return <React.StrictMode>{app}</React.StrictMode>;
}

export default React.memo(App);

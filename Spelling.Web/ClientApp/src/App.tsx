import React from 'react';
import './App.css';
import {
  Center,
  ChakraProvider,
  CSSReset,
  extendTheme,
  ThemeConfig,
} from '@chakra-ui/react';
import Timer from './Timer/Timer';
import { RecoilRoot } from 'recoil';
import { Alarm } from './Timer/alarms/Alarm';
import { StateInspector } from 'reinspect';
import { SessionInfo } from './Session/SessionInfo';
import { Controllers } from './Controllers';
import { BrowserRouter } from 'react-router-dom';
import SpellingTest from './SpellingTest/SpellingTest';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: {
    connectionString:
      'InstrumentationKey=37071687-29ff-43ac-8b58-f738db0a7448;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/',
  },
});
appInsights.loadAppInsights();
appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview

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
    <StateInspector name="App">
      <RecoilRoot>
        {/*<DebugObserver />*/}
        {/*<RecoilLogger />*/}
        <ChakraProvider theme={theme}>
          <BrowserRouter>
            <CSSReset />
            <Center minHeight="100vh" padding="0.75em">
              <SpellingTest />
            </Center>
            <Controllers />
          </BrowserRouter>
        </ChakraProvider>
      </RecoilRoot>
    </StateInspector>
  );

  const useStrictMode = import.meta.env.USE_STRICT_MODE;

  if (!useStrictMode) return app;

  console.log('Using StrictMode.');
  return <React.StrictMode>{app}</React.StrictMode>;
}

export default React.memo(App);

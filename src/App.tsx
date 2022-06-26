import { Suspense } from 'react';
import { Provider } from 'react-redux';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { CircularProgress } from '@mui/material';

import { BlockUpdater } from './lib/hooks/useBlockNumber';
import { MulticallUpdater } from './lib/state/multicall';
import Router from './routes';
import { store } from './state/store';
import ThemeConfig from './theme';
import { Snackbar } from './theme/uiComponents';

const client = new ApolloClient({
  uri: process.env.REACT_APP_SWELL_GRAPHQL_URI,
  cache: new InMemoryCache(),
});

function Updaters() {
  return (
    <>
      <BlockUpdater />
      <MulticallUpdater />
    </>
  );
}

const App = (): JSX.Element => (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Updaters />
      <ThemeConfig>
        <Snackbar maxSnack={2}>
          <Suspense fallback={<CircularProgress sx={{ margin: '50px auto' }} />}>
            <Router />
          </Suspense>
        </Snackbar>
      </ThemeConfig>
    </Provider>
  </ApolloProvider>
);

export default App;

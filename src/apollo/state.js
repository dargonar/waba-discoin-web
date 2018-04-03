import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory'

const cache = new InMemoryCache();

export const stateLink = withClientState({
    cache,
    defaults: {
      logginStatus: {
        __typename: 'LogginStatus',
        isConnected: false
      }
    }
  });
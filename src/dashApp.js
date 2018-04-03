import React from 'react';
import { Provider } from 'react-redux';
import { store, history } from './redux/store';
import PublicRoutes from './router';
import { ThemeProvider } from 'styled-components';
import { LocaleProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import themes from './config/themes';
import AppLocale from './languageProvider';
import config, {
  getCurrentLanguage
} from './containers/LanguageSwitcher/config';
import { themeConfig, siteConfig } from './config';
import DashAppHolder from './dashAppStyle';
import Boot from './redux/boot';

import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link"
//import { stateLink } from './apollo/state';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state';


import { appInitState, appResolvers } from './apollo/app'

const currentAppLocale =
  AppLocale[getCurrentLanguage(config.defaultLanguage || 'english').locale];


const cache = new InMemoryCache();

const defaultState = Object.assign({
  currentGame: {
    __typename: 'CurrentGame',
    score: 0
  },
  Auth: {
    __typename: 'Auth',
    idToken: null
  },
  router: {
    __typename: 'Router',
    location: {
      __typename: 'Location',
      pathname: '/',
      search: '',
      hash: ''
    }
  }
}, appInitState)

const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers: Object.assign({}, appResolvers)
});

const client = new ApolloClient({
  link: ApolloLink.from([
    stateLink,
    new HttpLink({
      uri: siteConfig.apiUrl
    })
  ]),
  cache,
});

const DashApp = () => (
  <LocaleProvider locale={currentAppLocale.antd}>
    <ApolloProvider client={client}>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
      >
        <ThemeProvider theme={themes[themeConfig.theme]}>
          <DashAppHolder>
            <Provider store={store}>
              <PublicRoutes history={history} />
            </Provider>
          </DashAppHolder>
        </ThemeProvider>
      </IntlProvider>
    </ApolloProvider>
  </LocaleProvider>
);
Boot()
  .then(() => DashApp())
  .catch(error => console.error(error));

export default DashApp;
export { AppLocale };

import { getDefaultPath } from '../helpers/urlSync';
import gql from 'graphql-tag'

//Util functions
export function getView(width) {
    let newView = 'MobileView';
    if (width > 1220) {
        newView = 'DesktopView';
    } else if (width > 767) {
        newView = 'TabView';
    }
    return newView;
}

const preKeys = getDefaultPath();

export const appInitState = {
    App: {
        __typename: 'App',
        collapsed: window.innerWidth > 1220 ? false : true,
        view: getView(window.innerWidth),
        height: window.innerHeight,
        openDrawer: false,
        openKeys: preKeys,
        current: preKeys
      }
}

const GET_APP_STATE = gql`
    query appState {
    App @client {
        __typename
        collapsed
        view
        height
        openDrawer
        openKeys
        current
    }
  }
`

export const appResolvers = {
    Mutation: {
        collapseChange: (_, { width }, { cache }) => {
            const data = {
                App: {
                    __typename: 'App',
                    collapsed: width > 1220 ? false : true
                },
            };
            cache.writeData({ data });
            return null
        },
        collapseOpenDrawer: (_, payload, { cache }) => {
            const appState = cache.readQuery({query: GET_APP_STATE })
            const data = {
                App: {
                    ...appState.App,
                    openDrawer: !appState.openDrawer
                },
            };
            cache.writeData({ data });
            return null;
        },
        toggleAll: (_, { width, height }, { cache }) => {
            console.log(width, height, getView(width))
            const appState = cache.readQuery({query: GET_APP_STATE })
            const view = getView(width)
            if (appState.App.view !== width || height !== appState.App.height) {
                const newHeight = height ? height : appState.App.height;
                const data = {
                    ...appState,
                    App: {
                        ...appState.App,
                        collapsed: view !== 'DesktopView',
                        view: view,
                        height: newHeight
                    }
                };
                console.log(data)
                cache.writeData({ data });
                return null;
              }
          },
    }
}









const actions = {
    COLLPSE_CHANGE: 'COLLPSE_CHANGE',
    COLLPSE_OPEN_DRAWER: 'COLLPSE_OPEN_DRAWER',
    CHANGE_OPEN_KEYS: 'CHANGE_OPEN_KEYS',
    TOGGLE_ALL: 'TOGGLE_ALL',
    CHANGE_CURRENT: 'CHANGE_CURRENT',
    toggleCollapsed: () => ({
      type: actions.COLLPSE_CHANGE
    }),
    toggleAll: (width, height) => {
      const view = getView(width);
      const collapsed = view !== 'DesktopView';
      return {
        type: actions.TOGGLE_ALL,
        collapsed,
        view,
        height
      };
    },
    toggleOpenDrawer: () => ({
      type: actions.COLLPSE_OPEN_DRAWER
    }),
    changeOpenKeys: openKeys => ({
      type: actions.CHANGE_OPEN_KEYS,
      openKeys
    }),
    changeCurrent: current => ({
      type: actions.CHANGE_CURRENT,
      current
    })
  };
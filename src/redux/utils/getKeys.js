import appActions from "../app/actions";
import { store } from "../store";

export const getKeys = () => {
  return new Promise((res, rej) => {
    // Si está desencriptado envio las keys
    if (store.getState().Auth.encrypted === false) {
      res(store.getState().Auth.keys);
      return;
    }
    //Si está encriptado pregunto al usuario
    const passwordBox = store.getState().App.get("passwordBox");
    const loading = store.getState().Auth.loading;

    if (!passwordBox && !loading) {
      // Muestro el box de autorización
      store.dispatch({ type: appActions.ASK_PASSWORD });
      // Escucho el store para ver los cambios
      store.subscribe(() => {
        //Si el box ya no se muestra más y tampoco hay un loading en auth
        //significa que o se canceló la acción o terminó el login
        const actualPasswordBox = store.getState().App.get("passwordBox");
        const actualLoading = store.getState().Auth.loading;
        if (!actualPasswordBox && !loading) {
          //segun lo que ocurrió envio la respuesta
          if (store.getState().Auth.encrypted === false) {
            res(store.getState().Auth.keys);
            return;
          } else {
            rej("Private keys encrypted");
            return;
          }
        }
        return;
      });
    }
  });
};

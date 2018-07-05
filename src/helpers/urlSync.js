import qs from "qs";

export function getInitData() {
  const initData = qs.parse(window.location.search.slice(1));
  if (initData.toggle)
    initData.toggle.free_shipping =
      initData.toggle.free_shipping === "true" ? true : undefined;
  return initData;
}
export function setUrl(searchState) {
  const search = searchState
    ? `${window.location.pathname}?${qs.stringify(searchState)}`
    : "";
  window.history.pushState(searchState, null, search);
}

export function getDefaultPath() {
  const getParent = lastRoute => {
    const parents = {
      ecommerce: []
    };
    let parent;
    Object.keys(parents).forEach(key => {
      parents[key].forEach(p => {
        if (p === lastRoute) {
          parent = key;
        }
      });
    });
    return parent ? [parent, lastRoute] : [lastRoute];
  };
  if (window && window.location.pathname) {
    const routes = window.location.pathname.split("/");
    if (routes.length > 1) {
      const lastRoute = routes[routes.length - 1];
      if (lastRoute) {
        return getParent(lastRoute);
      }
    }
  }
  return [];
}

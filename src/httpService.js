import pathToRegexp from 'path-to-regexp';
import { apiConfig } from './config';


export const apiCall = (path, method, data, cb) => {
    // Check if there are any callbacks established
    return () => {
        cb = (typeof cb === 'function')? cb: (res)=>res;

        let fetchOptions = {
            method: method || 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        }

        if (typeof data !== 'undefined') {
            fetchOptions.body = JSON.stringify(data);
        }

        return fetch( path, fetchOptions)
        .then(res => res.json() )
        .then(data => {
            cb(data)
            return { data };
        })
        .catch(ex => ({ ex }));
    };
};

export const getPath = (action, parameters) => {
    const actions = apiConfig.urls.map(url => ({ action:url.action, getPath: pathToRegexp.compile(url.path) }))
    let path = actions
        .filter(act => act.action === action)
        .reduce((pre,act) => act.getPath(parameters),'')

    return apiConfig.base + apiConfig.version + path;
};
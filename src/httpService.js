import pathToRegexp from 'path-to-regexp';
import { apiConfig } from './config';

const businessX = {  
                    account_name:   'discoin.biz3', 
                    account_id:     '1.2.25',
                    wif:            '5Kjz35R9W3m5ZpznZMSpdySz35tZsXZbzsuSdbtV12YC9Zaxzd9'
                }


export const business = {  
                    account_name:   'discoin.tuti', 
                    account_id:     '1.2.38',
                    wif:            '5KRV1uP8YEFc5S1UwJiC3fQPLrs7ArqWabii5FpYQf19xX3YvKh'
                }


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
        .catch(ex => ({ data: null, ex }));
    };
};

export const getPath = (action, parameters) => {
    const actions = apiConfig.urls.map(url => ({ action:url.action, getPath: pathToRegexp.compile(url.path) }))
    let path = actions
        .filter(act => act.action === action)
        .reduce((pre,act) => act.getPath(parameters),'')

    return apiConfig.base + apiConfig.version + path;
};


// ********************************************************************
// ********************************************************************

export const register = (json_data) => {

  const register_url  = getPath('URL/REGISTER_BUSINESS');
  
  console.log(' -- httpService::register::',JSON.stringify(json_data));

  return new Promise( (resolve, reject) => {
    fetch(register_url, {
        method:   'POST',
        headers:  {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body:     JSON.stringify(json_data)
      })
    .then((response) => response.json()
        , err => {
          console.log(' httpService::register() ===== #1' ,JSON.stringify(err));
          reject(err);
          return;
    })
    .then((responseJson) => {
      
        // QUE HAGO?
        console.log(' httpService::register() #2 ---- OK!');
        console.log(JSON.stringify(responseJson));
        resolve(responseJson);
    }, err => {
      console.log(' httpService::register() ===== #3' ,JSON.stringify(err));
      reject(err);
      return;
    });
  });
}

export const applyOverdraft = (business_name, signature) => {

  const url  = getPath('URL/APPLY_ENDORSE');
  
  console.log(' -- httpService::applyOverdraft::', business_name);

  return new Promise( (resolve, reject) => {
    fetch(url, {
        method:   'POST',
        headers:  {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body:     JSON.stringify({'business_name' : business_name})
      })
    .then((response) => response.json()
        , err => {
          console.log(' httpService::applyOverdraft() ===== #1' ,JSON.stringify(err));
          reject(err);
          return;
    })
    .then((responseJson) => {
      
        console.log(' httpService::applyOverdraft() #2 ---- responseJson:');
        console.log(JSON.stringify(responseJson));
        console.log(' --------- !');

        const push_url = getPath('URL/PUSH_SIGN_TX');
        let tx = responseJson.tx;

        fetch(push_url, {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify( {tx:tx, pk:signature})
          })
        .then((response) => response.json()
            , err => {
              console.log(' ===== #3' ,JSON.stringify(err));
              reject(err);
        })
        .then((responseJson) => {
          console.log('===========> pushAndSignTX()::res ==> ', JSON.stringify(responseJson));
          resolve(responseJson);
        }, err => {
          console.log(' ===== #4' ,JSON.stringify(err));
          reject(err);
        });



    }, err => {
      console.log(' httpService::applyOverdraft() ===== #3' ,JSON.stringify(err));
      reject(err);
      return;
    });
  });
}
export const rewardCustomer = (tx) => {
  
  const get_tx_url  = getPath('URL/REFUND_CREATE');
  tx.from_id = business.account_id;
  
  console.log(' -- rewardCustomer::',JSON.stringify(tx));

  return new Promise( (resolve, reject) => {
    fetch(get_tx_url, {
        method:   'POST',
        headers:  {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body:      JSON.stringify(tx)
      })
    .then((response) => response.json()
        , err => {
          console.log(' rewardCustomer() ===== #1' ,JSON.stringify(err));
          reject(err);
          return;
    })
    .then((responseJson) => {
      console.log('===========> rewardCustomer()::res #2 ==> ', JSON.stringify(responseJson));
      
      const push_url    = getPath('URL/PUSH_SIGN_TX');
      let tx2           = responseJson.tx;
      let packet        = {tx:tx2, pk:business.wif}

      console.log(' ---- A PUNTO DE RECOMPENSAR!!! -> tx2')
      console.log(JSON.stringify(packet))
      
      fetch(push_url, {
        method:   'POST',
        headers:  {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body:     JSON.stringify( packet )
        })
      .then((response) => response.json()
        , err => {
          console.log(' rewardCustomer() ===== #3' ,JSON.stringify(err));
          reject(err);
          return;
      })
      .then((responseJson2) => {
        console.log('===========> rewardCustomer()::res #4 ==> ', JSON.stringify(responseJson2));
        console.log(' == rewardCustomer() :: resolving!!!!!!!!');
        resolve(responseJson2);
        return;
      }, err => {
        console.log(' rewardCustomer() ===== #5' ,JSON.stringify(err));
        reject(err);
        return;
      });

    }, err => {
      console.log(' rewardCustomer() ===== #6' ,JSON.stringify(err));
      reject(err);
      return;
    });
  });
}


/*
// HOW TO USE:

//1. Set your api configutarion:
const apiConfig = {
    base: 'http://localhost/',
    verion: 'v1',
    urls: [{action:'test', patch: '/test/:id}]
};

//2. Build your path:
const testPath = getPath('test', {id: 1234}); //-> 'http://localhost/v1/test/1234'

//3. Get your call function:
const callTestAPI = apiCall(testPath)

//4. Execute!
callTestAPI() //-> return Promise

// Anothers examples: 

// POST
apiCall(testPath, 'POST', {name: 'marcos'})()

// SECUNDARY CALLBACK
// apiCall returns a promise but you can also run an additional callback.
apiCall(testPath, 'POST', {name: 'marcos'}, (res) => {console.log('RESPONSE', res)})
apiCall(testPath, 'GET', undefined, (res) => {console.log('RESPONSE', res)})

*/
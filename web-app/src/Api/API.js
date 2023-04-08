import axios from 'axios';

// Solr Server IP Address
export const ENDPOINT = 'http://localhost:8983';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'JWT fefege...',
  'Access-Control-Allow-Origin' : 'http://localhost:3000/Home'
}

export default class API {
  get(path) {
    return new Promise((resolve, reject) => {
      axios
        .get(path)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response);
        });
    });
  }
  post(path, data) {
    return new Promise((resolve, reject) => {
      axios
        .post(path, data , {
          headers: headers
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response);
        });
    });
  }
}

/*
AxiosHeaders(
            'Access-Control-Allow-Origin', '*',
            'Access-Control-Allow-Methods', 'POST, PUT, PATCH, GET, DELETE, OPTIONS',
            'Access-Control-Allow-Headers', 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization'
          )
headers:{
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, PUT, PATCH, GET, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization'
}
*/

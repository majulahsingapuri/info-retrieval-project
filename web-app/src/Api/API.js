import axios from 'axios';

// Solr Server IP Address
export const ENDPOINT = 'http://127.0.0.1:8983';

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
        .post(path, data)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response);
        });
    });
  }

}

const postDate = () => {
  axios.post('/localhost:5000', {
    MANUFACTURER: '',
    MODEL: '',
    YEAR: '',
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
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

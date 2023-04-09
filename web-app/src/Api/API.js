import axios from 'axios';

// Solr Server IP Address
export const ENDPOINT = `http://localhost:${process.env.NODE_ENV === "development" ? "8983": "80"}` ;

const headers = {
  'Content-Type': 'application/json',
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

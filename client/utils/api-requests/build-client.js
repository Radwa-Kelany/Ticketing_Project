// this method create client of axios that responsible for sending http requests to api endpoints,
// this client acts as blueprint for all axios methods,
// we add baseUrl and properties of request object if needed.

import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  }
  else{
    return axios.create({
        baseURL:"/"
    })
  }
};
export default buildClient;
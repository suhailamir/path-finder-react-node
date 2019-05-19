

import axios from 'axios';

export const getDestinations = () => (dispatch) => {
       axios.get('http://127.0.0.1:4545/destinations')
      .then(({ data }) => {
        dispatch({
          type: 'GET_DESTINATIONS',
          payload: data.data
        });
    })
    .catch((e) => {
      console.log('error :', e);
    });
};

export const getFares = formData => (dispatch) => {
   axios.post('http://127.0.0.1:4545/get-fares', formData)
    .then(({ data }) => {
      dispatch({
        type: 'GET_FARES',
        payload: data.data
      });
  });
};

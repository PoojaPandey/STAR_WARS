import axios from 'axios';

/**
 * Function to make webservice call.
 * This service will make get request
 * to the API and get the result.
 * On error log the error.
 */
function Webservice(props) {
  axios
    .get(props.url)
    .then(({ data }) => props.successCall(data))
    .catch(function(error) {
      console.log(error);
    });
}

export default Webservice;

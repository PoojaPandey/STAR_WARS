import axios from 'axios';

function LoginWithUserPassword(props) {
  axios
    .get()
    .then(function(response) {
      console.log('Login successfull');
    })
    .catch(function(error) {
      console.log(error);
    });
}

function Webservice(props) {
  axios
    .get(props.url)
    .then(function(response) {
      props.successCall(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

export default Webservice;

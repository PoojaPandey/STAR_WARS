import axios from 'axios';

function Webservice(props) {
  axios
    .get(props.url)
    .then(({ data }) => props.successCall(data))
    .catch(function(error) {
      console.log(error);
    });
}

export default Webservice;

import React, { Component } from 'react';
import './Login.css';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Webservice from '../../services/Service';
import * as constant from '../../utils/Constant';

/**
 * This class is for Login screen
 */
class Login extends Component {
  /**
   * This is the constructor method.
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  successCall = response => {
    console.log('response', response);
  };

  errorCall = error => {
    console.log(error);
  };
  validation() {
    const { username, password } = this.state;
    if (username.length === 0 || password.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  handleClick(event) {
    const { username, password } = this.state;
    if (this.validation()) {
      const url = constant.LOGIN + username;
      Webservice({ url: url, successCall: this.successCall });
    } else {
      alert('Invalid input');
    }
  }

  render() {
    return (
      <div className="LoginBody">
        <MuiThemeProvider>
          <img
            className="StartWarLooStyle"
            src={require('../../assets/images/star_wars_logo_2.png')}
            alt="logo"
          />
          <div className="LoginBase">
            <TextField
              error
              hintText="Enter your Username"
              floatingLabelText="Username"
              onChange={(event, newValue) =>
                this.setState({ username: newValue })
              }
              fullWidth
            />
            <TextField
              className="TextFieldStyle"
              type="password"
              hintText="Enter your Password"
              floatingLabelText="Password"
              onChange={(event, newValue) =>
                this.setState({ password: newValue })
              }
              fullWidth
            />
            <button
              className="btn btn-danger btn-lg"
              onClick={event => this.handleClick(event)}
            >
              LOGIN
            </button>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default Login;

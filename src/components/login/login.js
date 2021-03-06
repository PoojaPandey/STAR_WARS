import React, { Component } from 'react';
import './Login.css';
import Webservice from '../../services/Service';
import * as Constant from '../../utils/Constant';
import { browserHistory } from 'react-router';
import * as LocalStorage from '../../shared/LocalStorage';
import video from '../../assets/images/EarthSun.mp4';
import * as Sentry from '@sentry/browser';
import * as ErrorConstants from '../../utils/ErrorConstants';

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

  /**
   * Component Will Mount method
   * Checking in log getUser methods details.
   */
  componentWillMount() {
    console.log('LocalStorage', LocalStorage.getUser());
  }

  /**
   * Auth Setting for setting user props.
   */
  authSetting = props => LocalStorage.setUser(props);

  /**
   * To check succesfull response.
   */
  successCall = response => {
    console.log('response', response);
    const result = response['results'];
    const { password } = this.state;
    if (result.length !== 0) {
      if (password === result[0].birth_year) {
        const userData = result[0];
        this.authSetting(userData.name);
        browserHistory.push('/SearchScreen');
      } else {
        alert(ErrorConstants.ERROR_WRONG_USER);
      }
    } else {
      alert(ErrorConstants.ERROR_WRONG_USER);
    }
    this.setState({ username: '', password: '' });
  };

  /**
   * Method to check the password and
   * validate the same.
   * @param {*} password
   * @param {*} result
   */
  checkPassword(password, result) {
    if (password === result[0].birth_year) {
      console.log('password ===', password);
      const userData = result[0];
      this.authSetting(userData.name);
      this.setState({ username: null, password: null });
      browserHistory.push('/SearchScreen');
    } else {
      alert(ErrorConstants.ERROR_WRONG_USER);
    }
  }

  /**
   * Logging error to console.
   */
  errorCall = error => {
    console.log(error);
  };

  /**
   * Validation method to validate the user and password.
   */
  validation() {
    const { username, password } = this.state;
    if (
      username.length <= Constant.MIN_VALID_LENGTH ||
      password.length <= Constant.MIN_VALID_LENGTH
    ) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Handlle button click even of Login button.
   */
  onLoginClick() {
    const { username } = this.state;
    if (this.validation()) {
      const url = Constant.LOGIN + username;
      Webservice({ url: url, successCall: this.successCall });
    } else {
      alert(ErrorConstants.ERROR_INVALID_INPUT);
    }
  }

  /**
   * Handle error at the component level.
   * Making use of Sentry API to sending error
   * log to server with all details.
   * @param {*} error erro occured
   * @param {*} errorInfo detaild infor about the error.
   */
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
    this.setState({ error });
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  /**
   * Login form to read user namd and password.
   */
  loginForm() {
    return (
      <form>
        <input
          type="text"
          id="login"
          className="fadeIn second"
          name="login"
          placeholder="login"
        />
        <br />
        <input
          type="password"
          id="password"
          className="fadeIn third"
          name="login"
          placeholder="password"
        />
        <br />
        <input type="submit" className="fadeIn fourth" value="Log In" />
      </form>
    );
  }

  /**
   * Method to render the UI.
   */
  render() {
    if (LocalStorage.getUser()) {
      browserHistory.push('/SearchScreen');
    }
    return (
      <div className="LoginBody wrapper">
        <img
          className="StartWarLooStyle"
          src={require('../../assets/images/star_wars_logo_2.png')}
          alt="logo"
        />

        <div id="formContent">
          <input
            type="text"
            id="username"
            className="fadeIn second"
            name="username"
            placeholder="Enter Username"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <input
            type="password"
            id="password"
            className="fadeIn third"
            name="password"
            placeholder="Enter Password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <input
            type="submit"
            className="fadeIn fourth"
            onClick={this.onLoginClick.bind(this)}
            value="Log In"
          />
        </div>
      </div>
    );
  }
}

export default Login;

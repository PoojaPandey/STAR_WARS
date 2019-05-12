import React, { Component } from 'react';
import './Login.css';
import Webservice from '../../services/Service';
import * as constant from '../../utils/Constant';
import { browserHistory } from 'react-router';
import * as LocalStorage from '../../shared/LocalStorage';
import video from '../../assets/images/Galaxy.mp4';
import * as Sentry from '@sentry/browser';

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
    if (result[0] !== null) {
      if (password === result[0].birth_year) {
        console.log('password ===', password);
        const userData = result[0];
        this.authSetting(userData.name);
        this.setState({ username: null, password: null });
        console.log('push');
        browserHistory.push('/SearchScreen');
      } else {
        alert('Wrong username or password');
      }
    } else {
      alert('Wrong username or password');
    }
  };

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
    if (username.length <= 0 || password.length <= 0) {
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
      const url = constant.LOGIN + username;
      Webservice({ url: url, successCall: this.successCall });
    } else {
      alert('Invalid input');
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
   * Method to render the UI.
   */
  render() {
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
            placeholder="login"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <input
            type="text"
            id="password"
            className="fadeIn third"
            name="password"
            placeholder="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <input
            type="submit"
            className="fadeIn fourth LoinButton"
            onClick={this.onLoginClick.bind(this)}
            value="Log In"
          />
        </div>
      </div>
    );
  }
}

export default Login;

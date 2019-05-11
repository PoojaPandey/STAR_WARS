import React from 'react';

const AuthContext = React.createContext({
  username: '',
  isLoggedIn: false,
  updateUsername: () => {},
  setLoginStatus: () => {}
});

class AuthProvider extends React.Component {
  state = {
    isLoggedIn: false,
    username: '',
    updateUsername: this.updateUsername,
    setLoginStatus: this.setLoginStatus
  };
  updateUsername = newUsername => {
    this.setState({ username: newUsername });
  };
  setLoginStatus = loggedIn => {
    this.setState({ isLoggedIn: loggedIn });
  };
  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };

import * as constant from '../utils/Constant';

export function getUser() {
  const user = localStorage.getItem(constant.USERINFO);
  return user;
}
export function setUser(props) {
  localStorage.setItem(constant.USERINFO, props);
}

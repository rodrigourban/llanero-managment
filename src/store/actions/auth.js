import * as actionTypes from "./actionTypes";
import axios from "axios";
import { config } from "../../Constants";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, username, is_admin) => {
  return {
    type: actionTypes.AUTH_SUCESS,
    token: token,
    username: username,
    is_admin: is_admin,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("username");
  localStorage.removeItem("admin");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationDate) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationDate * 1000);
  };
};

export const authLogin = (username, password) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(`${config.url.API_URL}/rest-auth/login/`, {
        username: username,
        password: password,
      })
      .then((res) => {
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 36000 * 1000);
        const requestConfig = {
          headers: { Authorization: `Token ${token}` },
        };
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        axios
          .post(
            `${config.url.API_URL}/api/getUser`,
            {
              token: token,
            },
            requestConfig
          )
          .then((res) => {
            const admin = res.data.is_staff === true;
            localStorage.setItem("username", res.data.username);
            localStorage.setItem("admin", admin);
            dispatch(authSuccess(token, res.data.username, admin));
            dispatch(checkAuthTimeout(36000));
          })
          .catch((error) => {
            console.log("Error ", error);
            dispatch(authFail(error));
          });
      })

      .catch((error) => {
        console.log("Error ", error);
        dispatch(authFail(error));
      });
  };
};

export const authSignup = (username, email, password1, password2) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(`${config.url.API_URL}/rest-auth/registration/`, {
        username: username,
        email: email,
        password1: password1,
        password2: password2,
      })
      .then((res) => {
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 36000 * 1000);
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token));
        dispatch(checkAuthTimeout(36000));
      })
      .catch((error) => {
        dispatch(authFail(error));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const admin = localStorage.getItem("admin");
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const is_admin = admin === "true";
        dispatch(authSuccess(token, username, is_admin));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};

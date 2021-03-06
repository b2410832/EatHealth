import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import {
  getImageUrlFromStorage,
  postUser,
  createNativeUser,
} from "../../utils/firebase";
import logo from "../../images/logo-full.png";

import styles from "./SignUp.module.scss";

import Alert from "../Alert/Alert";

const SignUp = () => {
  let history = useHistory();
  let urlParams = new URLSearchParams(window.location.search);
  let to = urlParams.get("to");

  const [inputs, setInputs] = useState({ email: "", password: "", name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const handleInputChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const signUpWithEmailPassword = (email, password, displayName) => {
    setIsLoading(true);
    getImageUrlFromStorage("usersProfile", "avatar-4.png", (urlData) => {
      createNativeUser(email, password)
        .then((res) => {
          postUser(displayName, urlData);
          setInputs({ email: "", password: "", name: "" });
          setIsLoading(false);
          history.push("/");
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.code === "auth/invalid-email") {
            setShowAlert(true);
            setAlertText("請輸入完整的信箱格式");
          } else if (error.code === "auth/weak-password") {
            setShowAlert(true);
            setAlertText("請輸入6字以上的密碼");
          }
        });
    });
  };

  const toggleAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.left}></div>
        <div className={styles.right}>
          <div className={styles.signup}>
            <div className={styles.logo}>
              <Link to="/">
                <img src={logo} alt="logo"></img>
              </Link>
            </div>
            <h2 className={styles.title}>註冊會員</h2>
            <label htmlFor="email">
              姓名<span>(10字以內)</span>
            </label>
            <input
              type="text"
              name="name"
              value={inputs.name}
              onChange={handleInputChange}
              placeholder="請輸入姓名"
            ></input>
            <label htmlFor="email">信箱</label>
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleInputChange}
              placeholder="請輸入email信箱"
            ></input>
            <label htmlFor="password">
              密碼<span>(6字以上)</span>
            </label>
            <input
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleInputChange}
              placeholder="請輸入密碼"
            ></input>
            <button
              className={styles.fullBtn}
              onClick={() =>
                signUpWithEmailPassword(
                  inputs.email,
                  inputs.password,
                  inputs.name
                )
              }
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faCircleNotch} spin />
              ) : (
                "註冊"
              )}
            </button>
            <div>
              已經有帳號了嗎？
              <Link to={to ? `/login?to=${to}` : "/login"}>
                <span>登入會員</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {showAlert && <Alert text={alertText} handelConfirm={toggleAlert} />}
    </div>
  );
};

export default SignUp;

import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../../utils/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import styles from "./LogIn.module.scss";
import Alert from "../Alert/Alert";

const LogIn = ({ setUser, setDisplayName }) => {
  let history = useHistory();
  let urlParams = new URLSearchParams(window.location.search);
  let to = urlParams.get("to");

  const [inputs, setInputs] = useState({
    email: "test@test.test",
    password: "123456",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // 警告視窗
  const [alertText, setAlertText] = useState(""); // 警告視窗文字

  const handleInputChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  function signInWithEmailPassword(email, password) {
    setIsLoading(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        setUser(auth.currentUser); // displayName, email, uid, photoURL
        // setInputs({email:"", password:""});
        setIsLoading(false);
        to ? history.push(to) : history.push("/");
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.code === "auth/invalid-email") {
          setShowAlert(true);
          setAlertText("請輸入完整的信箱格式");
        } else if (error.code === "auth/weak-password") {
          setShowAlert(true);
          setAlertText("請輸入6字以上的密碼");
        } else if (error.code === "auth/user-not-found") {
          setShowAlert(true);
          setAlertText("找不到相符的用戶，請重新註冊帳號");
        } else if (error.code === "auth/wrong-password") {
          setShowAlert(true);
          setAlertText("密碼錯誤");
        }
        console.log(error);
      });
  }

  // alert點擊確認
  const toggleAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.left}></div>
        <div className={styles.right}>
          <div className={styles.signup}>
            <h2 className={styles.title}>登入</h2>
            <label htmlFor="email">信箱</label>
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleInputChange}
              placeholder="請輸入email信箱"
            ></input>
            <label htmlFor="password">密碼</label>
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
                signInWithEmailPassword(inputs.email, inputs.password)
              }
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faCircleNotch} spin />
              ) : (
                "登入"
              )}
            </button>
            <div>
              還沒有帳號嗎？
              <Link to={to ? `/signup?to=${to}` : "/signup"}>
                <span>註冊新帳號</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {showAlert && <Alert text={alertText} handelConfirm={toggleAlert} />}
    </div>
  );
};

export default LogIn;

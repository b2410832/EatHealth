import { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import { auth } from '../../firebase';


import styles from './LogIn.module.scss';

const LogIn = ({ setUser, setDisplayName }) => {
    let history = useHistory();
    let urlParams = new URLSearchParams(window.location.search);
    let to = urlParams.get("to");
    

    const [inputs, setInputs] = useState({email: "", password: ""});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value,
        });
    }

    function signInWithEmailPassword(email, password) {
        setIsLoading(true);
        auth.signInWithEmailAndPassword(email, password)
          .then((user) => {
            setUser(auth.currentUser); // displayName, email, uid, photoURL
            setInputs({email:"", password:""});
            setIsLoading(false);
            to ? history.push(to) : history.push("/")
          })
          .catch((error) => {
            alert(error.message);
            console.log(error); 
          });
      }

    return (
        <div className={styles.background}>
            <div className={styles.container}>
                <div className={styles.left}></div>
                <div className={styles.right}>
                    <div className={styles.signup}>
                        <h2 className={styles.title}>登入</h2>
                        <label htmlFor="email">信箱</label>
                        <input type="email" name="email" value={inputs.email} onChange={handleInputChange} placeholder="請輸入email信箱"></input>
                        <label htmlFor="password">密碼</label>
                        <input type="password" name="password" value={inputs.password} onChange={handleInputChange} placeholder="請輸入密碼"></input>
                        <button className={styles.fullBtn} onClick={() => signInWithEmailPassword(inputs.email, inputs.password)}>{isLoading ? "登入中..." : "登入"}</button>
                        <div>還沒有帳號嗎？<Link to={to? `/signup?to=${to}`: "/signup"}><span>註冊新帳號</span></Link></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogIn;
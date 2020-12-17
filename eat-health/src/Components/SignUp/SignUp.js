import { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import { auth, db, storage } from '../../firebase';
import firebase from "firebase/app";


import styles from './SignUp.module.scss';

const SignUp = ({ setUser }) => {
    let history = useHistory();
    let urlParams = new URLSearchParams(window.location.search);
    let to = urlParams.get("to");

    const [inputs, setInputs] = useState({email: "", password: "", name: ""});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value,
        });
    }
    
    const signUpWithEmailPassword = (email, password, displayName) => {
        setIsLoading(true);
        let photoURL = "";
        storage.ref('usersProfile').child('avatar-4.png').getDownloadURL().then(url=> photoURL = url)
        auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
            auth.currentUser.updateProfile({displayName: displayName, photoURL: photoURL});
            db.collection("users").doc(auth.currentUser.uid)
                .set({
                    displayName: displayName,
                    photoURL: photoURL,
                    email: auth.currentUser.email,
                    userId: auth.currentUser.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
                // .then(() => {
                //     // setUser(auth.currentUser);
                //     setUser({
                //         displayName: displayName,
                //         photoURL: photoURL,
                //         email: auth.currentUser.email,
                //         userId: auth.currentUser.uid,
                //     })
                // })
            setInputs({email:"", password:"", name:""});
            setIsLoading(false);
            to ? history.push(to) : history.push("/"); 
        })
          .catch((error) => {
            alert(error.message);
            console.log(error); //error.code, error.message
          });
      } 
    

      return (
        <div className={styles.background}>
            <div className={styles.container}>
                <div className={styles.left}></div>
                <div className={styles.right}>
                    <div className={styles.signup}>
                        <h2 className={styles.title}>註冊會員</h2>
                        <label htmlFor="email">姓名</label>
                        <input type="text" name="name" value={inputs.name} onChange={handleInputChange} placeholder="請輸入姓名"></input>
                        <label htmlFor="email">信箱</label>
                        <input type="email" name="email" value={inputs.email} onChange={handleInputChange} placeholder="請輸入email信箱"></input>
                        <label htmlFor="password">密碼</label>
                        <input type="password" name="password" value={inputs.password} onChange={handleInputChange} placeholder="請輸入密碼"></input>
                        <button className={styles.fullBtn} onClick={() => signUpWithEmailPassword(inputs.email, inputs.password, inputs.name)}>{isLoading? "註冊中..." : "註冊"}</button>
                        <div>已經有帳號了嗎？<Link to={to? `/login?to=${to}`: "/login"}><span>登入會員</span></Link></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp;
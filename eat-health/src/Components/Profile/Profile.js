import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, useRouteMatch, NavLink, useParams } from "react-router-dom";

import styles from "./Profile.module.scss";
import RecipeList from "../RecipeList/RecipeList";
import { db } from '../../firebase';
import defaultPhoto from "../../images/avatar-default.png";


const Profile = ({ user }) => {
    const [ profile, setProfile ] = useState({});
    const { url, path } = useRouteMatch();
    const { userId } = useParams();

    useEffect(() => {
        db.collection("users").doc(userId).get().then(doc => {
            const user = doc.data(); //物件
            setProfile(user);
        })
    }, []);

    return(
        <div className={styles.container}>
            <div className={styles.user}>
                <div className={styles.photo} >
                    <img src={profile.photoURL} alt="大頭照"></img>
                </div>
                <div className={styles.name}>{profile.displayName}</div>
            </div>
            <div className={styles.profile}>
                <ul className={styles.navbar}>
                    <NavLink exact to={url} activeClassName={styles.activeLink}><li>我的食譜</li></NavLink>
                    <NavLink exact to={`${url}/favorites`} activeClassName={styles.activeLink}><li>我的收藏</li></NavLink>
                    <NavLink exact to={`${url}/followings`} activeClassName={styles.activeLink}><li>追蹤中</li></NavLink>
                </ul>
                <div className={styles.content}>
                    <Switch>
                        <Route exact path={path} component={RecipeList}/>
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export default Profile;
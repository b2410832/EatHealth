import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  NavLink,
  useParams,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import styles from "./Profile.module.scss";
import SubProfile from "../SubProfile/SubProfile";

import { db } from "../../firebase";

const Profile = ({ user }) => {
  const [profile, setProfile] = useState({});
  const [recipes, setRecipes] = useState(0);
  const [fans, setFans] = useState(0);
  const [followings, setFollowings] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [gotFollowingsData, setGotFollowingsData] = useState(false);

  const { url, path } = useRouteMatch();
  const { userId } = useParams();

  useEffect(() => {
    setGotFollowingsData(false); //
    // 取得基本資訊
    db.collection("users")
      .doc(userId)
      .get()
      .then((doc) => {
        const user = doc.data();
        setProfile(user);
      });
    // 取得寫的食譜數量
    db.collection("recipes")
      .where("authorId", "==", userId)
      .get()
      .then((docs) => {
        setRecipes(docs.size);
      });
    // 取得粉絲數量
    db.collection("users")
      .doc(userId)
      .collection("fans")
      .onSnapshot((snapshots) => {
        setFans(snapshots.size);
      });
    // 取得追蹤中使用者id
    db.collection("users")
      .doc(userId)
      .collection("followings")
      .get()
      .then((docs) => {
        let followingList = [];
        docs.forEach((doc) => {
          followingList = [...followingList, doc.data().followingId];
        });
        setFollowings(followingList);
        setGotFollowingsData(true); //
      });
    // 取得使用者是否正在追蹤此人
    if (user && user.uid !== userId) {
      db.collection("users")
        .doc(user.uid)
        .collection("followings")
        .onSnapshot((snapshot) => {
          snapshot.docs.forEach((doc) => {
            if (doc.id === userId) {
              setIsFollowing(true);
            }
          });
        });
    }
  }, [userId]);

  const toggleFollowing = () => {
    setIsFollowing(!isFollowing);
    db.collection("users")
      .doc(user.uid)
      .collection("followings")
      .doc(userId)
      .get()
      .then((doc) => {
        doc.data()
          ? db
              .collection("users")
              .doc(user.uid)
              .collection("followings")
              .doc(userId)
              .delete()
              .then(() =>
                db
                  .collection("users")
                  .doc(userId)
                  .collection("fans")
                  .doc(user.uid)
                  .delete()
              )
          : db
              .collection("users")
              .doc(user.uid)
              .collection("followings")
              .doc(userId)
              .set({ followingId: userId })
              .then(() =>
                db
                  .collection("users")
                  .doc(userId)
                  .collection("fans")
                  .doc(user.uid)
                  .set({ fanId: user.uid })
              );
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <div className={styles.photo}>
          {profile ? <img src={profile.photoURL} alt="大頭照"></img> : null}
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{profile.displayName}</div>
          <div>{profile.email}</div>
        </div>
        <div>
          {user &&
            user.uid !== userId &&
            (isFollowing ? (
              <button className={styles.greyBtn} onClick={toggleFollowing}>
                <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>&nbsp;已追蹤
              </button>
            ) : (
              <button className={styles.darkBtn} onClick={toggleFollowing}>
                追蹤
              </button>
            ))}
        </div>
        <div className={styles.datas}>
          <div className={styles.data}>
            <div className={styles.number}>{recipes}</div>
            <div>食譜</div>
          </div>
          <div className={styles.data}>
            <div className={styles.number}>{fans}</div>
            <div>粉絲</div>
          </div>
          <div className={styles.data}>
            <div className={styles.number}>{followings.length}</div>
            <div>追蹤中</div>
          </div>
        </div>
      </div>
      <div className={styles.profile}>
        <ul className={styles.navbar}>
          <NavLink
            exact
            to={`${url}/myRecipes`}
            activeClassName={styles.activeLink}
          >
            <li>我的食譜</li>
          </NavLink>
          {user.uid === userId && (
            <NavLink
              exact
              to={`${url}/favorites`}
              activeClassName={styles.activeLink}
            >
              <li>我的收藏</li>
            </NavLink>
          )}
          {user.uid === userId && (
            <NavLink
              exact
              to={`${url}/followings`}
              activeClassName={styles.activeLink}
            >
              <li>追蹤中</li>
            </NavLink>
          )}
        </ul>
        <div className={styles.content}>
          <Switch>
            <Route
              exact
              path={`${path}/:subProfile`}
              render={() => (
                <SubProfile
                  followings={followings}
                  user={user}
                  gotFollowingsData={gotFollowingsData}
                  setGotFollowingsData={setGotFollowingsData}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Profile;

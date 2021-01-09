import { useEffect, useState } from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  NavLink,
  useParams,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import styles from "./Profile.module.scss";
import SubProfile from "../SubProfile/SubProfile";

import {
  toggleFollowing,
  getUser,
  getUserRecipe,
  getRealtimeFans,
  getRealtimeFollowings,
} from "../../utils/firebase";

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
    setGotFollowingsData(false);

    // 取得基本資料
    getUser(userId).then((userDoc) => {
      const user = userDoc.data();
      setProfile(user);
    });
    // 取得食譜數量
    getUserRecipe(userId).then((recipeDocs) => {
      setRecipes(recipeDocs.size);
    });
    // 取得粉絲數量
    const unsubscribeFans = getRealtimeFans(userId, (fans) => {
      setFans(fans.size);
    });

    // 取得追蹤列表
    const unsubscribeFollowingList = getRealtimeFollowings(
      userId,
      (followings) => {
        let followingList = [];
        followings.forEach((following) => {
          followingList = [...followingList, following.data().followingId];
        });
        setFollowings(followingList);
        setGotFollowingsData(true);
      }
    );

    // 取得使用者是否正在追蹤此人
    const unsubscribeIsFollowing = getRealtimeFollowings(
      user.uid,
      (followings) => {
        followings.forEach((following) => {
          if (following.id === userId) {
            setIsFollowing(true);
          }
        });
      }
    );

    return () => {
      unsubscribeFans();
      unsubscribeFollowingList();
      unsubscribeIsFollowing();
    };
  }, [userId]);

  const handleToggleFollowing = () => {
    setIsFollowing(!isFollowing);
    toggleFollowing(user.uid, userId);
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
              <button
                className={styles.greyBtn}
                onClick={handleToggleFollowing}
              >
                <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>&nbsp;已追蹤
              </button>
            ) : (
              <button
                className={styles.darkBtn}
                onClick={handleToggleFollowing}
              >
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

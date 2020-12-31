import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import styles from "./FollowList.module.scss";
import { db, toggleFollowing, getUser } from "../../utils/firebase";
import image from "../../images/noFollowing.png";

const FollowList = ({ followings, user, gotFollowingsData }) => {
  const [followingList, setFollowingList] = useState([]);

  let history = useHistory();

  useEffect(() => {
    let newFollowingList = [];
    followings.forEach((followingId) => {
      // 取得每個追蹤者的基本資訊
      getUser(followingId).then((user) => {
        const { userId, displayName, photoURL } = user.data();
        newFollowingList = [
          ...newFollowingList,
          { userId, displayName, photoURL, isFollowing: true },
        ];
      });
      // 取得每個追蹤者的食譜數
      db.collection("recipes")
        .where("authorId", "==", followingId)
        .get()
        .then((docs) => {
          newFollowingList = newFollowingList.map((item) => {
            if (item.userId === followingId) {
              return { ...item, recipes: docs.size };
            }
            return item;
          });
          // 取得每個追蹤者的粉絲數
          db.collection("users")
            .doc(followingId)
            .collection("fans")
            .get()
            .then((snapshots) => {
              newFollowingList = newFollowingList.map((item) => {
                if (item.userId === followingId) {
                  return { ...item, fans: snapshots.size };
                }
                return item;
              });
              // 取得使用者是否正在追蹤每個追蹤者
              db.collection("users")
                .doc(user.uid)
                .collection("followings")
                .get()
                .then((snapshots) => {
                  snapshots.forEach((snapshot) => {
                    newFollowingList = newFollowingList.map((item) => {
                      if (snapshot.id === item.userId) {
                        return { ...item, isFollowing: true };
                      }
                      return item;
                    });
                  });
                  setFollowingList(newFollowingList);
                });
            });
        });
    });
  }, [followings]);

  const handleToggleFollowing = (followId) => {
    followingList.forEach((item) => {
      if (item.userId === followId) {
        toggleFollowing(user.uid, followId);
      }
    });
  };

  const handleClickMore = () => {
    history.push("/recipes/?category=all");
  };

  if (gotFollowingsData) {
    return (
      <div className={styles.followListContainer}>
        {followings.length === 0 ? (
          <div className={styles.noFollowList}>
            <div className={styles.noFollowImage}>
              <img src={image} alt=""></img>
            </div>
            <div className={styles.text}>
              <div className={styles.title}>目前沒有追蹤中的人哦！</div>
              <div className={styles.description}>
                追蹤後即可於個人頁面
                <br />
                查看其他人寫的食譜
              </div>
              <button className={styles.fullBtn} onClick={handleClickMore}>
                查看更多食譜
              </button>
            </div>
          </div>
        ) : (
          followingList.map((following) => {
            return (
              <div className={styles.follow} key={following.userId}>
                <Link to={`/profile/${following.userId}/myRecipes`}>
                  <div className={styles.user}>
                    <div className={styles.image}>
                      <img src={following.photoURL} alt=""></img>
                    </div>
                    <div className={styles.info}>
                      <div className={styles.name}>{following.displayName}</div>
                      <div className={styles.details}>
                        <div className={styles.fans}>
                          粉絲&nbsp;{following.fans}
                        </div>
                        <div className={styles.recipes}>
                          食譜&nbsp;{following.recipes}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className={styles.followBtn}>
                  {following.isFollowing ? (
                    <button
                      className={styles.greyBtn}
                      onClick={() => handleToggleFollowing(following.userId)}
                    >
                      <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                      &nbsp;已追蹤
                    </button>
                  ) : (
                    <button
                      className={styles.darkBtn}
                      onClick={() => handleToggleFollowing(following.userId)}
                    >
                      追蹤
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default FollowList;

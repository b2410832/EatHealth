import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import styles from "./FollowList.module.scss";
import {
  toggleFollowing,
  getUser,
  getUserRecipe,
  getFans,
} from "../../utils/firebase";
import image from "../../images/noFollowing.png";

import Modal from "../Modal/Modal";

const FollowList = ({ followings, user, gotFollowingsData }) => {
  const [followingList, setFollowingList] = useState([]);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);

  let history = useHistory();

  useEffect(() => {
    let followingUsers = [];
    followings.forEach((followingId) => {
      let getUserData = [
        getUser(followingId),
        getUserRecipe(followingId),
        getFans(followingId),
      ];
      Promise.all(getUserData).then((res) => {
        followingUsers = [
          ...followingUsers,
          {
            userId: res[0].data().userId,
            displayName: res[0].data().displayName,
            photoURL: res[0].data().photoURL,
            isFollowing: true,
            recipes: res[1].size,
            fans: res[2].size,
          },
        ];
        setFollowingList(followingUsers);
      });
    });
  }, [followings]);

  const handleToggleFollowing = (followId) => {
    followingList.forEach((item) => {
      if (item.userId === followId) {
        toggleFollowing(user.uid, followId);
      }
    });
    setShowUnfollowModal(false);
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
              <div
                id={following.userId}
                className={styles.follow}
                key={following.userId}
              >
                {showUnfollowModal && (
                  <Modal
                    text="確定要取消追蹤此人？"
                    handleCancel={() => setShowUnfollowModal(false)}
                    handelConfirm={() =>
                      handleToggleFollowing(showUnfollowModal)
                    }
                  />
                )}
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
                      onClick={() => setShowUnfollowModal(following.userId)}
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

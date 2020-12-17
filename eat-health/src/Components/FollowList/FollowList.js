import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';



import styles from "./FollowList.module.scss";
import { db } from '../../firebase';


const FollowList = ({ followings, user }) => {
    const [ followingList, setFollowingList ] = useState([]);

    useEffect(() => {
        let newFollowingList = [];
        followings.forEach(followingId => {
            // 取得每個追蹤者的基本資訊
            db.collection("users").doc(followingId).get().then(doc => {
                const { userId, displayName, photoURL } = doc.data();
                newFollowingList = [ ...newFollowingList, { userId, displayName, photoURL, isFollowing: false}];
                setFollowingList(newFollowingList)
            })
            // 取得每個追蹤者的食譜數
            db.collection("recipes").where("authorId", "==", followingId).get().then(docs => {
                newFollowingList = newFollowingList.map(item => {
                    if(item.userId === followingId) {
                        return { ...item, recipes: docs.size}
                    }
                    return item;
                })
                // 取得每個追蹤者的粉絲數
                db.collection("users").doc(followingId).collection("fans").get().then(snapshots => {
                    newFollowingList = newFollowingList.map(item => {
                        if(item.userId === followingId) {
                            return { ...item, fans: snapshots.size}
                        }
                        return item;
                    })
                    // 取得使用者是否正在追蹤每個追蹤者
                    db.collection("users").doc(user.uid).collection("followings").get().then(snapshots => {
                        snapshots.forEach(snapshot  => {
                            newFollowingList = newFollowingList.map(item => {
                                if(snapshot.id === item.userId){
                                    return { ...item, isFollowing: true}
                                }
                                return item;
                            })
                        });
                        setFollowingList(newFollowingList);
                    })
                })
            })
        })
    }, [followings]);

    const toggleFollowing = (index) => {
        setFollowingList(followingList.map(item => {
            if(item.userId === index) {
                return { ...item, isFollowing: !item.isFollowing }
            }
            return item;
        }));
        followingList.forEach(item => {
            if(item.userId === index) {
                db.collection("users").doc(user.uid).collection("followings").doc(index).get().then(doc => {
                    doc.data() 
                    ? db.collection("users").doc(user.uid).collection("followings").doc(index).delete().then(() => (
                        db.collection("users").doc(index).collection("fans").doc(user.uid).delete()
                    ))
                    : db.collection("users").doc(user.uid).collection("followings").doc(index).set({followingId: index}).then(() => (
                        db.collection("users").doc(index).collection("fans").doc(user.uid).set({fanId: user.uid})
                    ))
                })
                .catch(err => console.log(err))
            }
        });
    }


    return (
        <div className={styles.followListContainer}>
            {
                followingList.map(following => {
                    return (
                        <div  className={styles.follow} key={following.userId}>
                            <Link to={`/profile/${following.userId}/myRecipes`}>
                                <div className={styles.user}>
                                    <div className={styles.image}>
                                        <img src={following.photoURL} alt=""></img>
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.name}>{following.displayName}</div>
                                        <div className={styles.details}>
                                            <div className={styles.fans}>粉絲&nbsp;{following.fans}</div>
                                            <div className={styles.recipes}>食譜&nbsp;{following.recipes}</div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <div className={styles.followBtn}>
                                {
                                    following.isFollowing 
                                    ? <button className={styles.greyBtn} onClick={() => toggleFollowing(following.userId)}><FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>&nbsp;已追蹤</button>
                                    : <button className={styles.darkBtn} onClick={() => toggleFollowing(following.userId)}>追蹤</button>
                                }
                            </div>
                        </div>
                    )
                })

            }
        </div>
    )
}

export default FollowList;
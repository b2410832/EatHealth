import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCommentAlt,
  faBookmark,
} from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faFullHeart,
  faBookmark as faFullBookmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./Recipe.module.scss";
import tipsBulb from "../../images/tips-bulb.svg";
import { db } from "../../firebase";
import Chart from "../Chart/Chart";
import Comments from "../Comments/Comments";
import CategoryBox from "../CategoryBox/CategoryBox";
import RecommendedBox from "../RecommendedBox/RecommendedBox";
import Alert from "../Alert/Alert";

const Recipe = ({ user }) => {
  let { recipeId } = useParams();

  const [recipe, setRecipe] = useState({});
  const [nutrition, setNutrition] = useState({
    calories: 0,
    carbsQty: 0,
    proteinQty: 0,
    fatQty: 0,
    proteinPercentage: 100,
    fatPercentage: 100,
    carbsPercentage: 100,
  });
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isFollowing, setIsfollowing] = useState(false);
  const [isMyself, setIsMyself] = useState(false);
  const [authorFans, setAuthorFans] = useState(0);
  const [showAlert, setShowAlert] = useState(false); // 警告視窗
  const [alertText, setAlertText] = useState(""); // 警告視窗文字

  useEffect(() => {
    setNutrition({
      calories: 0,
      carbsQty: 0,
      proteinQty: 0,
      fatQty: 0,
      proteinPercentage: 100,
      fatPercentage: 100,
      carbsPercentage: 100,
    });
    setIsLiked(false);
    setIsAdded(false);
    setIsfollowing(false);
    setIsMyself(false);
    // 更新食譜資料
    db.collection("recipes")
      .doc(recipeId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          let recipe = doc.data();
          setRecipe(recipe);
          // 計算食譜熱量和營養素
          let calories = Math.round(
            recipe.ingredients.reduce((totalCalorie, item) => {
              return item.calorie * (item.qty / 100) + totalCalorie;
            }, 0)
          );
          let carbsQty = Math.round(
            recipe.ingredients.reduce((totalCarbs, item) => {
              return item.carb * (item.qty / 100) + totalCarbs;
            }, 0)
          );
          let proteinQty = Math.round(
            recipe.ingredients.reduce((totalProteins, item) => {
              return item.protein * (item.qty / 100) + totalProteins;
            }, 0)
          );
          let fatQty = Math.round(
            recipe.ingredients.reduce((totalFats, item) => {
              return item.fat * (item.qty / 100) + totalFats;
            }, 0)
          );
          let proteinPercentage = Math.round(
            ((proteinQty * 4) / calories) * 100
          );
          let fatPercentage = Math.round(((fatQty * 9) / calories) * 100);
          let carbsPercentage = 100 - (proteinPercentage + fatPercentage);
          setNutrition({
            calories,
            carbsQty,
            proteinQty,
            fatQty,
            proteinPercentage,
            fatPercentage,
            carbsPercentage,
          });
          // 取得食譜作者的粉絲數
          db.collection("users")
            .doc(recipe.authorId)
            .collection("fans")
            .onSnapshot((snapshots) => {
              setAuthorFans(snapshots.size);
            });
          // 取得此食譜的讚數 //
          db.collectionGroup("liked")
            .where("recipeId", "==", recipe.id)
            .onSnapshot((snapshots) => {
              db.collection("recipes")
                .doc(recipe.id)
                .update({ liked: snapshots.docs.length });
            });
          // 取得此食譜的留言數 //
          db.collection("recipes")
            .doc(recipe.id)
            .collection("comments")
            .onSnapshot((snapshots) => {
              db.collection("recipes")
                .doc(recipe.id)
                .update({ comments: snapshots.docs.length });
            });
          // 此使用者是否按過這個食譜讚&收藏過&追蹤此作者
          if (user) {
            // 按讚
            db.collection("users")
              .doc(user.uid)
              .collection("liked")
              .onSnapshot((snapshot) => {
                setIsLiked(false); //
                snapshot.docs.forEach((doc) => {
                  if (doc.id === recipeId) {
                    return setIsLiked(true);
                  }
                });
              });
            // 收藏
            db.collection("users")
              .doc(user.uid)
              .collection("favorites")
              .onSnapshot((snapshot) => {
                setIsAdded(false); //
                snapshot.docs.forEach((doc) => {
                  if (doc.id === recipeId) {
                    return setIsAdded(true);
                  }
                });
              });

            if (user.uid === recipe.authorId) {
              setIsMyself(true);
            } else {
              // 追蹤
              db.collection("users")
                .doc(user.uid)
                .collection("followings")
                .onSnapshot((snapshot) => {
                  setIsfollowing(false); //
                  snapshot.docs.forEach((doc) => {
                    console.log(doc.id, recipe.authorId);
                    if (doc.id === recipe.authorId) {
                      return setIsfollowing(true);
                    }
                  });
                });
              setIsMyself(false);
            }
          }
        } else {
          console.log("doc not exist");
        }
      });
    // // 此使用者是否按過這個食譜讚&收藏過&追蹤此作者
    // if(user) {
    //     db.collection("users").doc(user.uid).collection("liked")
    //     .onSnapshot(snapshot => {
    //         snapshot.docs.forEach(doc  => {
    //             if(doc.id === recipeId){
    //                 setIsLiked(true);
    //             }
    //         });
    //     })
    //     db.collection("users").doc(user.uid).collection("favorites")
    //     .onSnapshot(snapshot => {
    //         snapshot.docs.forEach(doc  => {
    //             if(doc.id === recipeId){
    //                 setIsAdded(true);
    //             }
    //         });
    //     })

    //     if(user.uid === recipe.authorId) {
    //         setIsMyself(true);
    //     } else {
    //         // setIsfollowing(false);
    //         db.collection("users").doc(user.uid).collection("followings")
    //         .onSnapshot(snapshot => {
    //             snapshot.docs.forEach(doc  => {
    //                 console.log(doc.id, recipe.authorId);
    //                 if(doc.id === recipe.authorId){
    //                     setIsfollowing(true);
    //                 }
    //             });
    //         })
    //         setIsMyself(false);
    //     }
    // }
    // console.log("recipe.authorId:",recipe.authorId, "recipeId:",recipeId);
  }, [recipe.authorId, recipeId]);

  const toggleLiked = () => {
    if (user) {
      // setIsLiked(!isLiked);
      db.collection("users")
        .doc(user.uid)
        .collection("liked")
        .doc(recipeId)
        .get()
        .then((doc) => {
          doc.data()
            ? db
                .collection("users")
                .doc(user.uid)
                .collection("liked")
                .doc(recipeId)
                .delete()
            : db
                .collection("users")
                .doc(user.uid)
                .collection("liked")
                .doc(recipeId)
                .set({ recipeId: recipeId });
        })
        .catch((err) => console.log(err));
    } else {
      setShowAlert(true);
      setAlertText("請先登入會員才能按讚哦！");
    }
  };

  const toggleAdded = () => {
    if (user) {
      // setIsAdded(!isAdded);
      db.collection("users")
        .doc(user.uid)
        .collection("favorites")
        .doc(recipeId)
        .get()
        .then((doc) => {
          doc.data()
            ? db
                .collection("users")
                .doc(user.uid)
                .collection("favorites")
                .doc(recipeId)
                .delete()
            : db
                .collection("users")
                .doc(user.uid)
                .collection("favorites")
                .doc(recipeId)
                .set({ recipeId: recipeId });
        })
        .catch((err) => console.log(err));
    } else {
      setShowAlert(true);
      setAlertText("請先登入會員才能收藏哦！");
    }
  };

  const toggleFollowing = () => {
    if (user) {
      // setIsfollowing(!isFollowing);
      db.collection("users")
        .doc(user.uid)
        .collection("followings")
        .doc(recipe.authorId)
        .get()
        .then((doc) => {
          doc.data()
            ? db
                .collection("users")
                .doc(user.uid)
                .collection("followings")
                .doc(recipe.authorId)
                .delete()
                .then(() =>
                  db
                    .collection("users")
                    .doc(recipe.authorId)
                    .collection("fans")
                    .doc(user.uid)
                    .delete()
                )
            : db
                .collection("users")
                .doc(user.uid)
                .collection("followings")
                .doc(recipe.authorId)
                .set({ followingId: recipe.authorId })
                .then(() =>
                  db
                    .collection("users")
                    .doc(recipe.authorId)
                    .collection("fans")
                    .doc(user.uid)
                    .set({ fanId: user.uid })
                );
        })
        .catch((err) => console.log(err));
    } else {
      setShowAlert(true);
      setAlertText("請先登入會員才能追蹤哦！");
    }
  };

  // alert點擊確認
  const toggleAlert = () => {
    setShowAlert(!showAlert);
  };

  return (
    <main className={styles.container}>
      <div className={styles.recipeContainer}>
        <div className={styles.recipe}>
          <div className={styles.title}>{recipe.title}</div>
          <div className={styles.tag}>
            <small>{recipe.category}</small>
            <small>{recipe.mealTime}</small>
          </div>
          <div className={styles.main}>
            <div className={styles.image}>
              <img src={recipe.image} alt="食譜照片"></img>
            </div>
            <div className={styles.about}>
              <div className={styles.author}>
                <Link to={`/profile/${recipe.authorId}/myRecipes`}>
                  <div className={styles.profile}>
                    <img src={recipe.authorPhotoURL} alt=""></img>
                  </div>
                </Link>
                <div>
                  <Link to={`/profile/${recipe.authorId}/myRecipes`}>
                    <div className={styles.name}>{recipe.authorName}</div>
                  </Link>
                  <div>{authorFans} 個粉絲</div>
                </div>
                {isMyself === false &&
                  (isFollowing ? (
                    <button
                      className={styles.greyBtn}
                      onClick={toggleFollowing}
                    >
                      <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                      &nbsp;已追蹤
                    </button>
                  ) : (
                    <button
                      className={styles.darkBtn}
                      onClick={toggleFollowing}
                    >
                      追蹤
                    </button>
                  ))}
              </div>

              <div className={styles.likeComment}>
                <div>
                  <FontAwesomeIcon
                    icon={faHeart}
                    style={{ color: "#8a949f" }}
                  />
                  <span>{recipe.liked} 個讚</span>
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faCommentAlt}
                    style={{ color: "#8a949f" }}
                  />
                  <span>{recipe.comments} 則留言</span>
                </div>
              </div>
              <div className={styles.summary}>{recipe.summary}</div>
              <div className={styles.btnGroup}>
                <div className={styles.btn} onClick={toggleLiked}>
                  {isLiked ? (
                    <button className={styles.lineBtn}>
                      <FontAwesomeIcon
                        icon={faFullHeart}
                        style={{ color: "#fc4b4e", marginRight: "5px" }}
                      />
                      已按讚
                    </button>
                  ) : (
                    <button className={styles.lineBtn}>
                      <FontAwesomeIcon
                        icon={faHeart}
                        style={{ color: "#888888", marginRight: "5px" }}
                      />
                      按讚
                    </button>
                  )}
                </div>
                <div className={styles.btn} onClick={toggleAdded}>
                  {isAdded ? (
                    <button className={styles.lineBtn}>
                      <FontAwesomeIcon
                        icon={faFullBookmark}
                        style={{ color: "#3f3d56", marginRight: "5px" }}
                      />
                      已收藏
                    </button>
                  ) : (
                    <button className={styles.lineBtn}>
                      <FontAwesomeIcon
                        icon={faBookmark}
                        style={{ color: "#888888", marginRight: "5px" }}
                      />
                      收藏
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.information}>
            <div className={styles.head}>
              <div className={styles.texts}>熱量</div>
              <div>
                <strong>{nutrition.calories}</strong> 大卡
              </div>
            </div>
            <div className={styles.head}>
              <div className={styles.texts}>份量</div>
              <div>
                <strong>{recipe.portion}</strong> 人份
              </div>
            </div>
            <div className={styles.head}>
              <div className={styles.texts}>時間</div>
              <div>
                <strong>{recipe.cookTime}</strong> 分鐘
              </div>
            </div>
            <div className={styles.body}>
              <Chart color={"#85bf3e"} percentage={nutrition.carbsPercentage} />
              <div className={styles.texts}>
                <span className={styles.dot1}></span>碳水化合物
              </div>
              <div>
                <strong>{nutrition.carbsQty}</strong> 克
              </div>
            </div>
            <div className={styles.body}>
              <Chart
                color={"#fec740"}
                percentage={nutrition.proteinPercentage}
              />
              <div className={styles.texts}>
                <span className={styles.dot2}></span>蛋白質
              </div>
              <div>
                <strong>{nutrition.proteinQty}</strong> 克
              </div>
            </div>
            <div className={styles.body}>
              <Chart color={"#ff9300"} percentage={nutrition.fatPercentage} />
              <div className={styles.texts}>
                <span className={styles.dot3}></span>脂肪
              </div>
              <div>
                <strong>{nutrition.fatQty}</strong> 克
              </div>
            </div>
          </div>
          <div>
            <div className={styles.texts}>食材</div>
            {recipe.ingredients
              ? recipe.ingredients.map((item) => {
                  return (
                    <div className={styles.ingredient} key={item.id}>
                      <div>{item.name}</div>
                      <div>{item.qty} 公克</div>
                    </div>
                  );
                })
              : null}
          </div>
          <div>
            <div className={styles.texts}>步驟</div>
            {recipe.steps
              ? recipe.steps.map((step, index) => {
                  return (
                    <div className={styles.step} key={step.uid}>
                      <div className={styles.photo}>
                        {step.imageUrl ? (
                          <img
                            src={step.imageUrl}
                            alt={`步驟${index + 1}`}
                          ></img>
                        ) : (
                          <div></div>
                        )}
                      </div>
                      <div className={styles.content}>
                        <div className={styles.stepNumber}>{index + 1}.</div>
                        <p>{step.text}</p>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
          <div className={styles.tips}>
            <img src={tipsBulb} alt="小叮嚀" style={{ width: "30px" }} />
            <span className={styles.title}>
              <mark>小叮嚀</mark>
            </span>
            <div>{recipe.tips}</div>
          </div>
        </div>
        <Comments user={user} />
      </div>
      <div className={styles.side}>
        <RecommendedBox />
        <CategoryBox />
      </div>
      {showAlert && <Alert text={alertText} handelConfirm={toggleAlert} />}
    </main>
  );
};

export default Recipe;

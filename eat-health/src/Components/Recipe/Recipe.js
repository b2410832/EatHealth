import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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

import {
  toggleFollowing,
  toggleFavorite,
  toggleLiked,
  getRealtimeRecipe,
  getRealtimeFans,
  getRealtimeRecipeLikes,
  updateRecipe,
  getRealtimeRecipeComments,
  getRealtimeIsLiked,
  getRealtimeIsFavorite,
  getRealtimeFollowings,
} from "../../utils/firebase";
import styles from "./Recipe.module.scss";
import tipsBulb from "../../images/tips-bulb.svg";

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
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");

  const sumNutritionQty = (ingredients, nutrient) => {
    return Math.round(
      ingredients.reduce((total, ingredient) => {
        return ingredient[nutrient] * (ingredient.qty / 100) + total;
      }, 0)
    );
  };

  const countNutritionPercentage = (
    nutrientQty,
    totalCalories,
    caloriesPerGram
  ) => {
    return Math.round(((nutrientQty * caloriesPerGram) / totalCalories) * 100);
  };

  const countNutritionalFacts = (ingredients) => {
    const calories = sumNutritionQty(ingredients, "calorie");
    const carbsQty = sumNutritionQty(ingredients, "carb");
    const proteinQty = sumNutritionQty(ingredients, "protein");
    const fatQty = sumNutritionQty(ingredients, "fat");
    const proteinPercentage = countNutritionPercentage(proteinQty, calories, 4);
    const fatPercentage = countNutritionPercentage(fatQty, calories, 9);
    const carbsPercentage = 100 - (proteinPercentage + fatPercentage);
    return {
      calories,
      carbsQty,
      proteinQty,
      fatQty,
      proteinPercentage,
      fatPercentage,
      carbsPercentage,
    };
  };

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

    const unsubscribeRecipe = getRealtimeRecipe(recipeId, (recipeDoc) => {
      if (recipeDoc.exists) {
        // update recipe's details
        const recipe = recipeDoc.data();
        setRecipe(recipe);
        const nutritionalFacts = countNutritionalFacts(recipe.ingredients);
        setNutrition(nutritionalFacts);
        getRealtimeFans(recipe.authorId, (fans) => setAuthorFans(fans.size));
        getRealtimeRecipeLikes(recipe.id, (likes) =>
          updateRecipe(recipe.id, { liked: likes.length })
        );
        getRealtimeRecipeComments(recipe.id, (comments) =>
          updateRecipe(recipe.id, { comments: comments.length })
        );

        // update user's liked, favorite, following
        if (user) {
          getRealtimeIsLiked(user.uid, (likedRecipes) => {
            setIsLiked(false); //
            likedRecipes.forEach((likedRecipe) => {
              if (likedRecipe.id === recipeId) {
                return setIsLiked(true);
              }
            });
          });
          getRealtimeIsFavorite(user.uid, (favoriteRecipes) => {
            setIsAdded(false); //
            favoriteRecipes.forEach((favoriteRecipe) => {
              if (favoriteRecipe.id === recipeId) {
                return setIsAdded(true);
              }
            });
          });
          if (user.uid === recipe.authorId) {
            setIsMyself(true);
          } else {
            getRealtimeFollowings(user.uid, (followings) => {
              setIsfollowing(false); //
              followings.forEach((following) => {
                if (following.id === recipe.authorId) {
                  return setIsfollowing(true);
                }
              });
            });
            setIsMyself(false);
          }
        }
      }
    });
    return () => {
      unsubscribeRecipe();
    };
  }, [recipe.authorId, recipeId]);

  const handleToggleLiked = () => {
    if (user) {
      toggleLiked(user.uid, recipeId);
    } else {
      setShowAlert(true);
      setAlertText("請先登入會員才能按讚哦！");
    }
  };

  const handleToggleFavorite = () => {
    if (user) {
      toggleFavorite(user.uid, recipeId);
    } else {
      setShowAlert(true);
      setAlertText("請先登入會員才能收藏哦！");
    }
  };

  const handleToggleFollowing = () => {
    if (user) {
      toggleFollowing(user.uid, recipe.authorId);
    } else {
      setShowAlert(true);
      setAlertText("請先登入會員才能追蹤哦！");
    }
  };

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
                      onClick={handleToggleFollowing}
                    >
                      <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                      &nbsp;已追蹤
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
                <div className={styles.btn} onClick={handleToggleLiked}>
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
                <div className={styles.btn} onClick={handleToggleFavorite}>
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
        <div className={styles.commentBox}>
          <Comments user={user} />
        </div>
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

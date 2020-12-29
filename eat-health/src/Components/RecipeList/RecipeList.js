import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getFavorites, getRecipe, getAllRecipes } from "../../utils/firebase";
import styles from "./RecipeList.module.scss";
import image from "../../images/noRecipe.png";

import RecipeListItem from "../RecipeListItem/RecipeListItem";

const RecipeList = ({ subProfile }) => {
  const [recipeList, setRecipeList] = useState([]);
  const [gotData, setGotData] = useState(false);

  let { userId } = useParams();

  let urlParams = new URLSearchParams(window.location.search);
  let category = urlParams.get("category");
  let mealTime = urlParams.get("mealTime");

  useEffect(() => {
    setGotData(false);
    setRecipeList([]);

    if (subProfile === "favorites") {
      getFavorites(userId).then((favorites) => {
        const getFavoritesData = [];
        favorites.forEach((favorite) => {
          getFavoritesData.push(getRecipe(favorite.id));
        });
        Promise.all(getFavoritesData).then((favoriteDocs) => {
          setRecipeList(
            favoriteDocs.map((favoriteDoc) => {
              return { ...favoriteDoc.data(), liked: 0, commments: 0 };
            })
          );
          setGotData(true);
        });
      });
    } else {
      getAllRecipes().then((recipesDocs) => {
        setRecipeList(
          recipesDocs.docs.map((recipeDoc) => {
            return { ...recipeDoc.data(), like: 0, commments: 0 };
          })
        );
        setGotData(true);
      });
    }
  }, [subProfile]);

  let filteredRecipeList = recipeList
    .filter((recipe) => {
      switch (category) {
        case "balanced":
          return recipe.category === "均衡料理";
        case "lowcarbs":
          return recipe.category === "減醣料理";
        case "highpt":
          return recipe.category === "增肌料理";
        default:
          return true;
      }
    })
    .filter((recipe) => {
      switch (mealTime) {
        case "breakfast":
          return recipe.mealTime === "早餐";
        case "lunchDinner":
          return recipe.mealTime === "午晚餐";
        case "dessert":
          return recipe.mealTime === "點心";
        default:
          return true;
      }
    })
    .filter((recipe) => {
      if (subProfile === "myRecipes") {
        return recipe.authorId === userId;
      }
      return true;
    });

  if (gotData) {
    return (
      <div className={styles.recipeList}>
        {filteredRecipeList.length > 0 ? (
          filteredRecipeList.map((recipe) => {
            return <RecipeListItem recipe={recipe} key={recipe.id} />;
          })
        ) : (
          <div className={styles.noRecipeList}>
            <div className={styles.noRecipeImage}>
              <img src={image} alt=""></img>
            </div>
            <div className={styles.text}>
              <div className={styles.title}>目前還沒有食譜哦！</div>
              <div className={styles.description}>
                分享自己的料理，
                <br />
                一起加入健康食分吧！
              </div>
              <Link to="/writeRecipe">
                <button className={styles.fullBtn}>開始寫食譜</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default RecipeList;

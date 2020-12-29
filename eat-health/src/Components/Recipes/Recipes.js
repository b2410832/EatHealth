import { useEffect, useState } from "react";
import { NavLink, Switch } from "react-router-dom";

import styles from "./Recipes.module.scss";

import RecipeList from "../RecipeList/RecipeList";
import CategoryBox from "../CategoryBox/CategoryBox";

const Recipes = () => {
  const [categoryName, setCategoryName] = useState("全部料理");
  const [categoryEnglish, setCategoryEnglish] = useState("ALL RECIPES");
  let urlParams = new URLSearchParams(window.location.search);
  let category = urlParams.get("category");
  let mealTime = urlParams.get("mealTime");

  useEffect(() => {
    switch (category) {
      case "all":
        setCategoryName("全部料理");
        setCategoryEnglish("ALL RECIPES");
        break;
      case "balanced":
        setCategoryName("均衡料理");
        setCategoryEnglish("BALANCED");
        break;
      case "lowcarbs":
        setCategoryName("減醣料理");
        setCategoryEnglish("LOW CARBS");
        break;
      case "highpt":
        setCategoryName("增肌料理");
        setCategoryEnglish("HIGH PROTEINS");
        break;
      default:
        setCategoryName("全部料理");
    }
  }, [category]);

  const checkActive = (query) => {
    return mealTime === query;
  };

  return (
    <div className={styles.recipesContainer}>
      <div className={styles.banner}>
        <div>{categoryName}</div>
        <div className={styles.categoryEnglish}>{categoryEnglish}</div>
      </div>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.recipes}>
            <div className={styles.mealTime}>
              <NavLink
                exact
                to={`/recipes?category=${category}`}
                activeClassName={styles.mealTimeActive}
                isActive={() => checkActive(null)}
              >
                全部
              </NavLink>
              <NavLink
                exact
                to={`/recipes?category=${category}&mealTime=breakfast`}
                activeClassName={styles.mealTimeActive}
                isActive={() => checkActive("breakfast")}
              >
                早餐
              </NavLink>
              <NavLink
                exact
                to={`/recipes?category=${category}&mealTime=lunchDinner`}
                activeClassName={styles.mealTimeActive}
                isActive={() => checkActive("lunchDinner")}
              >
                午 / 晚餐
              </NavLink>
              <NavLink
                exact
                to={`/recipes?category=${category}&mealTime=dessert`}
                activeClassName={styles.mealTimeActive}
                isActive={() => checkActive("dessert")}
              >
                點心 / 下午茶
              </NavLink>
            </div>
            <RecipeList />
          </div>
          <CategoryBox />
        </div>
      </div>
    </div>
  );
};

export default Recipes;

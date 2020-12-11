import {  NavLink } from "react-router-dom";

import styles from "./Recipes.module.scss";
import RecipeList from "../RecipeList/RecipeList";

const Recipes = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let category = urlParams.get("category");
    return (
        <div className={styles.container}>
            <div className={styles.mealTime}>
                <NavLink to={`/recipes?category=${category}`}>全部</NavLink>
                <NavLink to={`/recipes?category=${category}&mealTime=breakfast`}>早餐</NavLink>
                <NavLink to={`/recipes?category=${category}&mealTime=lunchDinner`}>午 / 晚餐</NavLink>
                <NavLink to={`/recipes?category=${category}&mealTime=dessert`}>點心 / 下午茶</NavLink>
            </div>
            <RecipeList/>
        </div>
    )
}

export default Recipes;
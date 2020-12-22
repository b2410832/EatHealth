import { useEffect, useState } from "react";
import {  NavLink, Switch } from "react-router-dom";

import styles from "./Recipes.module.scss";
import RecipeList from "../RecipeList/RecipeList";
import CategoryBox from "../CategoryBox/CategoryBox";

const Recipes = () => {
    const [categoryName, setCategoryName] = useState("全部料理");
    const [categoryEnglish, setCategoryEnglish ] = useState("ALL RECIPES")
    let urlParams = new URLSearchParams(window.location.search);
    let category = urlParams.get("category");

    useEffect(() => {
        switch(category) {
            case "all" :
                setCategoryName("全部料理");
                setCategoryEnglish("ALL RECIPES");
                break;
            case "balanced" :
                setCategoryName("均衡料理");
                setCategoryEnglish("BALANCED");
                break;
            case "lowcarbs" :
                setCategoryName("減醣料理");
                setCategoryEnglish("LOW CARBS");
                break;
            case "highpt" :
                setCategoryName("增肌料理");
                setCategoryEnglish("HIGH PROTEINS");
                break;
            default:
                setCategoryName("全部料理");
        }
    }, [category]);

    return (
        <div>
            <div className={styles.banner}>
                <div>{categoryName}</div>
                <div className={styles.categoryEnglish}>{categoryEnglish}</div>
            </div>
            <div className={styles.container}>
                <div className={styles.category}><mark>{categoryName}</mark></div>
                <div className={styles.main}>
                    <div className={styles.mealTime}>
                        <NavLink to={`/recipes?category=${category}`}>全部</NavLink>
                        <NavLink to={`/recipes?category=${category}&mealTime=breakfast`}>早餐</NavLink>
                        <NavLink to={`/recipes?category=${category}&mealTime=lunchDinner`}>午 / 晚餐</NavLink>
                        <NavLink to={`/recipes?category=${category}&mealTime=dessert`}>點心 / 下午茶</NavLink>
                    </div>
                    <RecipeList/>
                    <CategoryBox/>
                </div>
            </div>
        </div>
    )
}

export default Recipes;
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useHistory, useRouteMatch, useParams, NavLink } from "react-router-dom";

import RecipeListItem from "../RecipeListItem/RecipeListItem"
import styles from './RecipeList.module.scss';
import { db } from '../../firebase';

const RecipeList = ({ subProfile }) => {
    const [ recipeList, setRecipeList ] = useState([]);

    // 個人頁面-收藏食譜
    let { userId } = useParams();

    // 食譜列表-篩選食譜
    let urlParams = new URLSearchParams(window.location.search);
    let category = urlParams.get("category");
    let mealTime = urlParams.get("mealTime");
    
    useEffect(() => {
        setRecipeList([]);
        if(subProfile === "favorites") {
            db.collection("users").doc(userId).collection("favorites").get().then(docs => {
                let favorites = [];
                docs.forEach(doc => {
                    db.collection("recipes").doc(doc.id).get().then(doc => {
                        const recipe = doc.data();
                        favorites = [...favorites, {
                            id: recipe.id,
                            image: recipe.image,
                            title: recipe.title,
                            authorName: recipe.authorName,
                            authorId: recipe.authorId,
                            authorPhotoURL: recipe.authorPhotoURL,
                            category: recipe.category,
                            mealTime: recipe.mealTime,
                            liked: 0,
                            commments: 0,
                        }];
                        setRecipeList(favorites);
                    })
                })
            })
        } else {
            db.collection("recipes").get().then(docs => {
                let newRecipeList = [];
                docs.forEach(doc => {
                    const recipe = doc.data(); 
                    newRecipeList = [...newRecipeList,{
                        id: recipe.id,
                        image: recipe.image,
                        title: recipe.title,
                        authorName: recipe.authorName,
                        authorId: recipe.authorId,
                        authorPhotoURL: recipe.authorPhotoURL,
                        category: recipe.category,
                        mealTime: recipe.mealTime,
                        liked: 0,
                        commments: 0,
                    }]
                })
                setRecipeList(newRecipeList);
            })
        }
    }, [subProfile]);

    return(
        <div className={styles.recipeList}>
            {
                recipeList
                    .filter(recipe => {
                        switch (category) {
                            case "balanced" :
                                return recipe.category === "均衡料理";
                            case "lowcarbs" :
                                return recipe.category === "減醣料理";
                            case "highpt" :
                                return recipe.category === "增肌料理";
                            default:
                                return true;
                        }
                    })
                    .filter(recipe => {
                        switch (mealTime) {
                            case "breakfast" :
                                return recipe.mealTime === "早餐";
                            case "lunchDinner" :
                                return recipe.mealTime === "午晚餐";
                            case "dessert" :
                                return recipe.mealTime === "點心";
                            default:
                                return true;
                        }
                    })
                    .filter(recipe => {
                        if(subProfile === "myRecipes") {
                            return recipe.authorId === userId;
                        }
                        return true;
                    })
                    .map((recipe) => {
                        return (
                            <RecipeListItem recipe={recipe} key={recipe.id}/>
                        )
                    })
            }
        </div>
    )
}

export default RecipeList;
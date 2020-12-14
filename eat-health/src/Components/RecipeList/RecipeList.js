import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentAlt } from '@fortawesome/free-regular-svg-icons'
import { BrowserRouter as Router, Switch, Route, Link, useHistory, useRouteMatch, useParams, NavLink } from "react-router-dom";

import RecipeListItem from "../RecipeListItem/RecipeListItem"
import styles from './RecipeList.module.scss';
import { db } from '../../firebase';

const RecipeList = () => {
    const [recipeList, setRecipeList] = useState([]);
    let { path, url } = useRouteMatch();
    let { userId } = useParams();

    let urlParams = new URLSearchParams(window.location.search);
    let category = urlParams.get("category");
    let mealTime = urlParams.get("mealTime");
    console.log(userId, path, category, mealTime);


    useEffect(() => {
        db.collection("recipes").get()
        .then(docs => {
            let newRecipeList = [];
            docs.forEach(doc => {
                const recipe = doc.data(); 
                newRecipeList = [
                    ...newRecipeList,
                    {
                        id: recipe.id,
                        image: recipe.image,
                        title: recipe.title,
                        authorName: recipe.authorName,
                        authorId: recipe.authorId,
                        authorPhotoURL: recipe.authorPhotoURL,
                        category: recipe.category,
                        mealTime: recipe.mealTime,
                        liked: 0,
                    }
                ]
                // 取得此食譜的讚數
                // db.collectionGroup("liked").where("recipeId", "==", recipe.id).get()
                // .then(snapshots => snapshots.forEach(snapshot => {
                //     // newRecipeList.forEach(item => {
                //     //     if(item.id === recipe.id){
                //     //         item.liked++;
                //     //     }
                //     // })
                    
                //     setRecipeList(newRecipeList.map(item => {
                //         console.log(item.id, recipe.id);
                //         if(item.id === recipe.id) {
                //             return ({ ...item, liked:item.liked++})
                //         }
                //         return item;
                //     }))
                // }))
            })
            setRecipeList(newRecipeList);
        })
    }, []);

    // console.log(JSON.stringify(recipeList));
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
                    if(userId) {
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
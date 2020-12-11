import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentAlt } from '@fortawesome/free-regular-svg-icons'
import { BrowserRouter as Router, Switch, Route, Link, useHistory, useRouteMatch, useParams, NavLink } from "react-router-dom";

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
        db.collection("recipes").get().then(docs => {
            let newRecipeList = [...recipeList];
            docs.forEach(doc => {
                const recipe = doc.data(); //物件
                newRecipeList.push({
                    id: recipe.id,
                    image: recipe.image,
                    title: recipe.title,
                    authorName: recipe.authorName,
                    authorId: recipe.authorId,
                    authorPhotoURL: recipe.authorPhotoURL,
                    category: recipe.category,
                    mealTime: recipe.mealTime,
                })
            })
            setRecipeList(newRecipeList);
        })
    }, []);

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
                .map(recipe => {
                    return (
                        <Link to={`/recipes/${recipe.id}`} key={recipe.id}>
                            <div className={styles.recipe}>
                                <div className={styles.image}>
                                    <img src={recipe.image} alt="食譜照片"></img>
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.title}>{recipe.title}</div>
                                    <div className={styles.author}>By {recipe.authorName}</div>
                                    <div><small>{recipe.category}</small> <small>{recipe.mealTime}</small></div>
                                    <div className={styles.likeComment}>
                                        <div>
                                            <FontAwesomeIcon icon={faHeart} style={{color:"#8a949f"}}/>
                                            <span className={styles.text}>0 個讚</span>
                                        </div>
                                        <div>
                                            <FontAwesomeIcon icon={faCommentAlt} style={{color:"#8a949f"}}/>
                                            <span className={styles.text}>0 則留言</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })
            }
        </div>
    )
}

export default RecipeList;
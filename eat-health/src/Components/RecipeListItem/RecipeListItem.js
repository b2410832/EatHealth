import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCommentAlt } from '@fortawesome/free-regular-svg-icons'
import { BrowserRouter as Router, Switch, Route, Link, useHistory, useRouteMatch, useParams, NavLink } from "react-router-dom";

import styles from "./RecipeListItem.module.scss";
import { db } from '../../firebase';

const RecipeListItem = ({ recipe }) => {
    const [recipeData, setRecipeData] = useState(recipe);

    useEffect(() => {
        let liked = 0;
        let comments = 0;
        // 取得此食譜的讚數
        db.collectionGroup("liked").where("recipeId", "==", recipe.id).onSnapshot((snapshots) => {
            liked = snapshots.docs.length;
            db.collection("recipes").doc(recipe.id).update({liked: snapshots.docs.length});

            // 取得此食譜的留言數
            db.collection("recipes").doc(recipe.id).collection("comments").onSnapshot((snapshots => {
                comments = snapshots.docs.length;
                db.collection("recipes").doc(recipe.id).update({comments: snapshots.docs.length});
                setRecipeData({...recipeData, liked, comments});
            }))
        })
    }, []);
    

    return (
        <Link to={`/recipes/${recipeData.id}`}>
            <div className={styles.recipe}>
                <div className={styles.image}>
                    <img src={recipeData.image} alt="食譜照片"></img>
                </div>
                <div className={styles.content}>
                    <div className={styles.title}>{recipeData.title}</div>
                    <div className={styles.author}>By {recipeData.authorName}</div>
                    <div><small>{recipeData.category}</small> <small>{recipeData.mealTime}</small></div>
                    <div className={styles.likeComment}>
                        <div>
                            <FontAwesomeIcon icon={faHeart} style={{color:"#8a949f"}}/>
                            <span className={styles.text}>{recipeData.liked} 個讚</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faCommentAlt} style={{color:"#8a949f"}}/>
                            <span className={styles.text}>{recipeData.comments} 則留言</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default RecipeListItem;
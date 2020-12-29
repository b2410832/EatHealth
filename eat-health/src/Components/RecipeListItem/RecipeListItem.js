import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCommentAlt } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

import {
  getRealtimeRecipeLikes,
  getRealtimeRecipeComments,
  updateRecipe,
} from "../../utils/firebase";
import styles from "./RecipeListItem.module.scss";

const RecipeListItem = ({ recipe }) => {
  const [recipeData, setRecipeData] = useState(recipe);

  useEffect(() => {
    getRealtimeRecipeLikes(recipe.id, (likesData) => {
      getRealtimeRecipeComments(recipe.id, (commentsData) => {
        const updates = {
          comments: commentsData.length,
          liked: likesData.length,
        };
        updateRecipe(recipe.id, updates);
        setRecipeData({ ...recipeData, ...updates });
      });
    });
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
          <div>
            <small>{recipeData.category}</small>{" "}
            <small>{recipeData.mealTime}</small>
          </div>
          <div className={styles.likeComment}>
            <div>
              <FontAwesomeIcon icon={faHeart} style={{ color: "#8a949f" }} />
              <span className={styles.text}>{recipeData.liked} 個讚</span>
            </div>
            <div>
              <FontAwesomeIcon
                icon={faCommentAlt}
                style={{ color: "#8a949f" }}
              />
              <span className={styles.text}>{recipeData.comments} 則留言</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeListItem;

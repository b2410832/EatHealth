import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import styles from "./RecommendedBox.module.scss";
import { db } from '../../firebase';


const RecommendedBox = () => {
    const [ recommmendedList, setRecommmendedList ] = useState([]);

    let { recipeId } = useParams();

    useEffect(() => {
        db.collection("recipes").where("id", "!=", recipeId).limit(5).get().then((docs) => {
            let recommended = []
            docs.forEach(doc => {
                let recipe = doc.data();
                recommended = [ ...recommended, {
                    id: recipe.id,
                    authorName: recipe.authorName,
                    image: recipe.image,
                    title: recipe.title,
                }]
            })
            setRecommmendedList(recommended);
        })
    }, [recipeId]);

    

    return (
        <div className={styles.recommendedContainer}>
            <div className={styles.title}>其他推薦食譜</div>
            <div className={styles.recommendedList}>
                {
                    recommmendedList.map(recommended => {
                        return(
                            <div className={styles.recommended} key={recommended.id} >
                                <Link to={`/recipes/${recommended.id}`}>
                                    <div className={styles.image}>
                                        <img src={recommended.image} alt=""></img>
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.text}>{recommended.title}</div>
                                        <div className={styles.author}>by {recommended.authorName}</div>
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default RecommendedBox;
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import styles from "./Home.module.scss";
import coverPhoto from "../../images/cover.svg";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

const Home = () => {
    const [latest, setLatest] = useState([]);

    useEffect(() => {
        db.collection("recipes").orderBy("createdTime", "desc").limit(4).get().then(docs => {
            let data = [];
            docs.forEach(doc => {
                let recipe = doc.data();
                data = [ ...data, {
                    title: recipe.title,
                    authorName: recipe.authorName,
                    category: recipe.category,
                    mealTime: recipe.mealTime,
                    image: recipe.image,
                    id: recipe.id,
                }]
            })
            setLatest(data);
        })
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.cover}>
                <div className={styles.cta}>
                    <div className={styles.slogan}>You Are<br/>What You EAT</div>
                    <div className={styles.intro}>全台灣最溫馨的<br/>健康食譜分享社群</div>
                    <Link to="/recipes?category=all">
                        <button className={styles.ctaBtn}>查看所有食譜 &nbsp;<FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></button>
                    </Link>
                </div>
                <img src={coverPhoto} alt="cover"></img>
            </div>
            <div className={styles.main}>
                <div className={styles.latest}>
                    <div className={styles.title}><mark>最新食譜</mark></div>
                    <div className={styles.newRecipes}>
                        {
                            latest.map((recipe, index) => {
                                return(
                                    <Link to={`/recipes/${recipe.id}`} key={recipe.id}>
                                        <div className={styles.recipe}>
                                            <div className={styles.image}>
                                                <img src={recipe.image} alt=""></img>
                                            </div>
                                            <div className={styles.body}>
                                                <div className={styles.name}>{recipe.title}</div>
                                                <div className={styles.author}>by {recipe.authorName}</div>
                                                <div className={styles.tag}>
                                                    <small>{recipe.category}</small>
                                                    <small>{recipe.mealTime}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
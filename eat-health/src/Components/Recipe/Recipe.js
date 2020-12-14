import { BrowserRouter as Router, Switch, Route, Link, useHistory, useRouteMatch, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCommentAlt, faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faFullHeart } from '@fortawesome/free-solid-svg-icons'


import styles from './Recipe.module.scss';
import tipsBulb from '../../images/tips-bulb.svg';
import { db } from '../../firebase';
import Chart from "../Chart/Chart";
import Comments from "../Comments/Comments";
import firebase from "firebase/app";


const Recipe = ({ user }) => {
    let { recipeId } = useParams();

    const [ recipe, setRecipe ] = useState({});
    const [ nutrition, setNutrition ] = useState({
        calories:0, 
        carbsQty:0, 
        proteinQty:0,
        fatQty:0,
        proteinPercentage:100,
        fatPercentage:100,
        carbsPercentage:100,
    });
    const [ isLiked, setIsLiked ] = useState(false);

    useEffect(() => {
        db.collection("recipes").doc(recipeId).onSnapshot((doc) => {
            if(doc.exists) {
                let recipe = doc.data();
                setRecipe(recipe);
                // count recipe's nutritional facts
                let calories = Math.round(recipe.ingredients.reduce((totalCalorie, item) => {
                    return (item.calorie * (item.qty/100)) + totalCalorie;   
                }, 0))
                let carbsQty = Math.round(recipe.ingredients.reduce((totalCarbs, item) => {
                    return (item.carb * (item.qty/100)) + totalCarbs;
                }, 0))
                let proteinQty = Math.round(recipe.ingredients.reduce((totalProteins, item) => {
                    return item.protein * (item.qty/100) + totalProteins;
                }, 0))
                let fatQty = Math.round(recipe.ingredients.reduce((totalFats, item) => {
                    return item.fat * (item.qty/100) + totalFats;
                }, 0))
                let proteinPercentage = Math.round((proteinQty * 4)/calories * 100);
                let fatPercentage = Math.round((fatQty * 9)/calories * 100);
                let carbsPercentage = 100 - (proteinPercentage + fatPercentage);
                setNutrition({ calories, carbsQty, proteinQty, fatQty, proteinPercentage, fatPercentage, carbsPercentage});
            } else {
                console.log("doc not exist");
            }
        });
        // 使用者是否按過這個食譜讚
        if(user) {
            db.collection("users").doc(user.uid).collection("liked")
            .onSnapshot(snapshot => {
                snapshot.docs.forEach(doc  => {
                    if(doc.id === recipeId){
                        setIsLiked(true);
                    }
                });
            })
        }
    }, []);


    const toggleLiked = () => {
        if(user) {
            setIsLiked(!isLiked);
            db.collection("users").doc(user.uid).collection("liked").doc(recipeId).get()
                .then(doc => {
                    doc.data() ?
                    db.collection("users").doc(user.uid).collection("liked").doc(recipeId).delete()
                    : db.collection("users").doc(user.uid).collection("liked").doc(recipeId).set({recipeId:recipeId})
                })
                .catch(err => console.log(err))
        } else {
            alert("請先登入才能按讚哦！");
        }
    }

    return(
        <main className={styles.container}>
            <div className={styles.recipeContainer}>
                <div className={styles.title}>{recipe.title}</div>
                <div className={styles.tag}>
                    <small>{recipe.category}</small>
                    <small>{recipe.mealTime}</small>
                </div>
                <div className={styles.main}>
                    <div className={styles.image}>
                        <img src={recipe.image} alt="食譜照片"></img>
                    </div>
                    <div className={styles.about}>
                        <div className={styles.author}>
                            <div className={styles.profile}>
                                <img src={recipe.authorPhotoURL} alt=""></img>
                            </div>
                            <div>
                                <div className={styles.name}>{recipe.authorName}</div>
                                <div>0 個粉絲</div>
                            </div>
                            <button className={styles.darkBtn}>追蹤</button>
                        </div>
                        
                        <div className={styles.likeComment}>
                            <div>
                                <FontAwesomeIcon icon={faHeart} style={{color:"#8a949f"}}/>
                            <span>{recipe.liked} 個讚</span>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faCommentAlt} style={{color:"#8a949f"}}/>
                                <span>{recipe.comments} 則留言</span>
                            </div>
                        </div>
                        <div className={styles.summary}>{recipe.summary}</div>
                        <div className={styles.btnGroup}>
                            <div className={styles.btn} onClick={toggleLiked}>
                                {
                                    isLiked ?
                                    <button className={styles.lineBtn}>
                                        <FontAwesomeIcon icon={faFullHeart} style={{color:"#fc4b4e", marginRight:"5px"}}/>已按讚
                                    </button>
                                    : <button className={styles.lineBtn}>
                                        <FontAwesomeIcon icon={faHeart} style={{color:"#888888", marginRight:"5px"}}/>按讚
                                    </button>
                                }
                            </div>
                            <div className={styles.btn}>
                                <button className={styles.lineBtn}><FontAwesomeIcon icon={faBookmark} style={{color:"#888888", marginRight:"5px"}}/>收藏</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.information}>
                    <div className={styles.head}>
                        <div className={styles.texts}>熱量</div>
                        <div><strong>{nutrition.calories}</strong> 大卡</div>
                    </div>
                    <div className={styles.head}>
                        <div className={styles.texts}>份量</div>
                        <div><strong>{recipe.portion}</strong> 人份</div>
                    </div>
                    <div className={styles.head}>
                        <div className={styles.texts}>時間</div>
                        <div><strong>{recipe.cookTime}</strong> 分鐘</div>
                    </div>
                    <div className={styles.body}>
                        <Chart color={"#85bf3e"} percentage={nutrition.carbsPercentage}/>
                        <div className={styles.texts}><span className={styles.dot1}></span>碳水化合物</div>
                        <div><strong>{nutrition.carbsQty}</strong> 克</div>
                    </div>
                    <div className={styles.body}>
                        <Chart color={"#fec740"} percentage={nutrition.proteinPercentage}/>
                        <div className={styles.texts}><span className={styles.dot2}></span>蛋白質</div>
                        <div><strong>{nutrition.proteinQty}</strong> 克</div>
                    </div>
                    <div className={styles.body}>
                        <Chart color={"#ff9300"} percentage={nutrition.fatPercentage}/>
                        <div className={styles.texts}><span className={styles.dot3}></span>脂肪</div>
                        <div><strong>{nutrition.fatQty}</strong> 克</div>
                    </div>
                </div>
                <div>
                    <div className={styles.texts}>食材</div>
                    {   recipe.ingredients ? 
                        recipe.ingredients.map(item => {
                            return (
                                <div className={styles.ingredient} key={item.id}>
                                    <div>{item.name}</div> 
                                    <div>{item.qty} 公克</div>
                                </div>
                            )
                        })
                        :
                        null
                    }
                </div>
                <div>
                    <div className={styles.texts}>步驟</div>
                    <div className={styles.steps}>
                        <div className={styles.stepNumber}>1.</div>
                        <pre>{recipe.step1}</pre>
                    </div>
                    <div className={styles.steps}>
                        <div className={styles.stepNumber}>2.</div>
                        <pre>{recipe.step2}</pre>
                    </div>
                    <div className={styles.steps}>
                        <div className={styles.stepNumber}>3.</div>
                        <pre>{recipe.step3}</pre>
                    </div>
                    <div className={styles.steps}>
                        <div className={styles.stepNumber}>4.</div>
                        <pre>{recipe.step4}</pre>
                    </div>
                </div>
                <div className={styles.tips}>
                    <img src={tipsBulb} alt="小叮嚀" style={{width: "30px"}}/>
                    <span className={styles.title}><mark>小叮嚀</mark></span>
                    <div>{recipe.tips}</div>
                </div>
            </div>
            <Comments user={user}/>
        </main>
    )
}

export default Recipe;
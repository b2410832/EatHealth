import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { getLatests, getMealTimes } from "../../utils/firebase";
import styles from "./Home.module.scss";
import coverPhoto from "../../images/cover.svg";
import image from "../../images/noRecipe.png";

const Home = () => {
  const [latest, setLatest] = useState([]);
  const [breakfast, setBreakfast] = useState([]);
  const [dessert, setDessert] = useState([]);
  const [dinner, setDinner] = useState([]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 500 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 500, min: 0 },
      items: 1,
    },
  };

  useEffect(() => {
    getLatests().then((latests) => {
      setLatest(latests.docs.map((latest) => latest.data()));
    });

    getMealTimes("早餐").then((breakfasts) => {
      setBreakfast(breakfasts.docs.map((breakfast) => breakfast.data()));
    });

    getMealTimes("點心").then((desserts) => {
      setDessert(desserts.docs.map((dessert) => dessert.data()));
    });
    // 午晚餐
    getMealTimes("午晚餐").then((dinners) => {
      setDinner(dinners.docs.map((dinner) => dinner.data()));
    });
  }, []);

  const CustomRightArrow = ({ onClick, ...rest }) => {
    return <button onClick={() => onClick()} className={styles.rightArrow} />;
  };

  const CustomLeftArrow = ({ onClick, ...rest }) => {
    return <button onClick={() => onClick()} className={styles.leftArrow} />;
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.banner}>
        <div className={styles.cta}>
          <div className={styles.sloganContainer}>
            <div className={styles.slogan}>
              <div>
                健康食分
                <br />
                給你十分的健康
              </div>
            </div>
            <div className={styles.intro}>
              食譜分享社群平台
              <br />
              讓你發掘更多健康料理
            </div>
            <Link to="/recipes?category=all">
              <button className={styles.ctaBtn}>
                查看所有食譜 &nbsp;
                <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
              </button>
            </Link>
          </div>
        </div>
        <div className={styles.cover}>
          <img src={coverPhoto} alt="cover"></img>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.latest}>
          <div className={styles.title}>最新食譜</div>
          <div className={styles.newRecipes}>
            <Carousel
              responsive={responsive}
              slidesToSlide={2}
              swipeable
              customLeftArrow={<CustomLeftArrow />}
              customRightArrow={<CustomRightArrow />}
            >
              {latest.map((recipe, index) => {
                return (
                  <div className={styles.recipe} key={recipe.id}>
                    <Link to={`/recipes/${recipe.id}`}>
                      <div className={styles.image}>
                        <img src={recipe.image} alt=""></img>
                      </div>
                      <div className={styles.body}>
                        <div className={styles.name}>{recipe.title}</div>
                        <div className={styles.author}>
                          by {recipe.authorName}
                        </div>
                        <div className={styles.tag}>
                          <small>{recipe.category}</small>
                          <small>{recipe.mealTime}</small>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </Carousel>
          </div>
        </div>
        <div className={styles.categoryContainer}>
          <div className={styles.categories}>
            <Link to="/recipes?category=all">
              <div className={`${styles.category} ${styles.all}`}>
                <div className={styles.text}>全部料理</div>
              </div>
            </Link>
            <Link to="/recipes?category=balanced">
              <div className={`${styles.category} ${styles.balanced}`}>
                <div className={styles.text}>均衡料理</div>
              </div>
            </Link>
            <Link to="/recipes?category=lowcarbs">
              <div className={`${styles.category} ${styles.lowcarbs}`}>
                <div className={styles.text}>減醣料理</div>
              </div>
            </Link>
            <Link to="/recipes?category=highpt">
              <div className={`${styles.category} ${styles.highpt}`}>
                <div className={styles.text}>增肌料理</div>
              </div>
            </Link>
          </div>
        </div>
        <div className={styles.latest}>
          <div className={styles.title}>早安，來點營養滿分的早餐吧！</div>
          <div className={styles.newRecipes}>
            <Carousel
              responsive={responsive}
              slidesToSlide={2}
              swipeable
              customLeftArrow={<CustomLeftArrow />}
              customRightArrow={<CustomRightArrow />}
            >
              {breakfast.map((recipe) => {
                return (
                  <div className={styles.recipe} key={recipe.id}>
                    <Link to={`/recipes/${recipe.id}`}>
                      <div className={styles.image}>
                        <img src={recipe.image} alt=""></img>
                      </div>
                      <div className={styles.body}>
                        <div className={styles.name}>{recipe.title}</div>
                        <div className={styles.author}>
                          by {recipe.authorName}
                        </div>
                        <div className={styles.tag}>
                          <small>{recipe.category}</small>
                          <small>{recipe.mealTime}</small>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </Carousel>
          </div>
        </div>
        <div className={styles.latest}>
          <div className={styles.title}>美好的下午茶時光</div>
          <div className={styles.newRecipes}>
            <Carousel
              responsive={responsive}
              slidesToSlide={2}
              swipeable
              customLeftArrow={<CustomLeftArrow />}
              customRightArrow={<CustomRightArrow />}
            >
              {dessert.map((recipe) => {
                return (
                  <div className={styles.recipe} key={recipe.id}>
                    <Link to={`/recipes/${recipe.id}`}>
                      <div className={styles.image}>
                        <img src={recipe.image} alt=""></img>
                      </div>
                      <div className={styles.body}>
                        <div className={styles.name}>{recipe.title}</div>
                        <div className={styles.author}>
                          by {recipe.authorName}
                        </div>
                        <div className={styles.tag}>
                          <small>{recipe.category}</small>
                          <small>{recipe.mealTime}</small>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </Carousel>
          </div>
        </div>
        <div className={styles.latest}>
          <div className={styles.title}>
            下班了嗎？來快速煮個好吃又健康的晚餐吧！
          </div>
          <div className={styles.newRecipes}>
            <Carousel
              responsive={responsive}
              slidesToSlide={2}
              swipeable
              customLeftArrow={<CustomLeftArrow />}
              customRightArrow={<CustomRightArrow />}
            >
              {dinner.map((recipe) => {
                return (
                  <div className={styles.recipe} key={recipe.id}>
                    <Link to={`/recipes/${recipe.id}`}>
                      <div className={styles.image}>
                        <img src={recipe.image} alt=""></img>
                      </div>
                      <div className={styles.body}>
                        <div className={styles.name}>{recipe.title}</div>
                        <div className={styles.author}>
                          by {recipe.authorName}
                        </div>
                        <div className={styles.tag}>
                          <small>{recipe.category}</small>
                          <small>{recipe.mealTime}</small>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </Carousel>
          </div>
        </div>
        <div className={styles.noRecipeList}>
          <div className={styles.noRecipeImage}>
            <img src={image} alt=""></img>
          </div>
          <div className={styles.text}>
            <div className={styles.titles}>喜歡這些食譜嗎？</div>
            <div className={styles.description}>
              分享自己的拿手健康料理，
              <br />
              一起加入健康食分吧！
            </div>
            <Link to="/writeRecipe">
              <button className={styles.fullBtn}>開始寫食譜</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

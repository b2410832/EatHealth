import { Link } from "react-router-dom";

import styles from "./CategoryBox.module.scss";

const CategoryBox = () => {
    return (
        <div className={styles.categoryContainer}>
            <div className={styles.title}>食譜分類</div>
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
    )
}

export default CategoryBox;
import styles from "./Loading.module.scss";

// import loadingAnimation from "../../images/loading-cooking.gif";

const Loading = () => {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
        </div>
    )
}

export default Loading;
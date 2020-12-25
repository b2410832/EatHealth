import styles from "./Alert.module.scss";

const Alert = ({ text, handelConfirm }) => {
    return (
        <div className={styles.alertContainer}>
            <div className={styles.alert}>
                <div className={styles.text}>{text}</div>
                <div className={styles.btnGroup}>
                    <button className={styles.fullBtn} onClick={handelConfirm}>確認</button>
                </div>
            </div>
        </div>    
    )
}

export default Alert;
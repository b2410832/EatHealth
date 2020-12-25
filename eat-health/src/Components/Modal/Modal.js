import styles from "./Modal.module.scss";

const Modal = ({ text, handleCancel, handelConfirm }) => {
    return (
        <div className={styles.modalContainer}>
            <div className={styles.modal}>
                <div className={styles.text}>{text}</div>
                <div className={styles.btnGroup}>
                    <button className={styles.lineBtn} onClick={handleCancel}>取消</button>
                    <button className={styles.fullBtn} onClick={handelConfirm}>確認</button>
                </div>
            </div>
        </div>
    )
}

export default Modal;
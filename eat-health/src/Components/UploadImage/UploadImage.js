
import styles from './UploadImage.module.scss';

const UploadImage = ({file, handleFile, url}) => {
    const clearMemory = () => {
        URL.revokeObjectURL(url); // free memory
    }

    return(
        <div className={styles.upload}>
            <div className={styles.imageContainer}>
                <img src={url} alt="食譜圖片" onLoad={clearMemory} className={styles.image}></img>
            </div>
            <label htmlFor="upload-image" className={styles.label}>點擊上傳食譜照片</label>
            <input type="file" accept="image/*" onChange={handleFile} className={styles.input} id="upload-image"></input>
        </div>
    )
}

export default UploadImage;
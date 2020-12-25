import { useState } from "react";

import styles from './UploadImage.module.scss';
import defaultImg from "../../images/upload.png"


const UploadImage = ({ file, setFile }) => {
    const [ objectUrl, setObjectUrl ] = useState(defaultImg); // 預覽上傳的照片

    const handleFile = (e) => {
        setFile(e.target.files[0]); // file object
        setObjectUrl(URL.createObjectURL(e.target.files[0])); // ObjectURL
    }
    
    const clearMemory = () => {
        URL.revokeObjectURL(objectUrl); // free memory
    }

    return(
        <div>
            <div className={styles.text}>封面照片</div>
            <div className={styles.upload}>
                <div className={styles.imageContainer}>
                    <img src={objectUrl} alt="食譜圖片" onLoad={clearMemory} className={styles.image}></img>
                </div>
                <label htmlFor="upload-image" className={styles.label}>點擊上傳食譜封面照片</label>
                <input type="file" accept="image/*" onChange={handleFile} className={styles.input} id="upload-image"></input>
            </div>
        </div>
    )
}

export default UploadImage;
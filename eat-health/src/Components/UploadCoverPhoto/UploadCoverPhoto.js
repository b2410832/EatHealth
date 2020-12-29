import { useState } from "react";

import styles from "./UploadCoverPhoto.module.scss";
import defaultImg from "../../images/upload.png";

const UploadImage = ({ setCoverPhoto }) => {
  const [previewCoverPhoto, setPreviewCoverPhoto] = useState(defaultImg);

  const handleFile = (e) => {
    setCoverPhoto(e.target.files[0]);
    setPreviewCoverPhoto(URL.createObjectURL(e.target.files[0]));
  };

  const clearMemory = () => {
    URL.revokeObjectURL(previewCoverPhoto);
  };

  return (
    <div>
      <div className={styles.text}>封面照片</div>
      <div className={styles.upload}>
        <div className={styles.imageContainer}>
          <img
            src={previewCoverPhoto}
            alt="食譜圖片"
            onLoad={clearMemory}
            className={styles.image}
          ></img>
        </div>
        <label htmlFor="upload-image" className={styles.label}>
          點擊上傳食譜封面照片
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className={styles.input}
          id="upload-image"
        ></input>
      </div>
    </div>
  );
};

export default UploadImage;


import styles from './Steps.module.scss';

import defaultImg from "../../images/upload.png"


const Steps = ({ steps, setSteps }) => {
    const handleTextChange = (e, uid) => {
        setSteps(steps.map(item => 
          item.uid === uid ? {...item, text: e.target.value} : item
        ));
    }

    const addStep = () => {
        setSteps([...steps, {
            uid: `${new Date().getTime()}`, 
            text:"", 
            image: "",
        }]);
    }

    const deleteStep = (uid) => {
        setSteps(steps.filter(item => item.uid !== uid));
    }

    return(
        <div className={styles.stepsContainer}>
            <div className={styles.text}>步驟</div>
            {
                steps.map((step, index) => {
                    return (
                    <div className={styles.step} key={step.uid}>
                         <div className={styles.upload}>
                            <div className={styles.imageContainer}>
                                <img src={defaultImg} alt="食譜圖片" className={styles.image}></img>
                            </div>
                            <label htmlFor="upload-image" className={styles.label}>點擊上傳步驟照片</label>
                            <input type="file" accept="image/*"className={styles.input} id="upload-image"></input>
                        </div>
                        <div className={styles.content}>
                            <div className={styles.stepNumber}>{index+1}.</div>
                            <textarea placeholder="請輸入步驟說明" value={step.text} onChange={(e) => handleTextChange(e, step.uid)}></textarea>
                        </div>
                        <div className={styles.delete} onClick={() => deleteStep(step.uid)}></div>
                    </div>
                    
                    )
                })
            }
            <button className={styles.button} onClick={addStep}>+ 新增步驟</button>
        </div>    
    )
}

export default Steps;
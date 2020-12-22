
import styles from './Steps.module.scss';
import defaultImg from "../../images/upload.png";



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
            imageUrl: null,
            objectUrl: defaultImg, 
            file: null,
        }]);
    }

    const deleteStep = (uid) => {
        setSteps(steps.filter(item => item.uid !== uid));
    }

    const handleFile = (e, uid) => {
        let file = e.target.files[0];
        let objectUrl = URL.createObjectURL(e.target.files[0]);

        setSteps(steps.map(step => {
            if(step.uid === uid) {
                return { ...step, file, objectUrl }
            }
            return step;
        }))
    }
    
    const clearMemory = (uid) => {
        steps.forEach(step => {
            if(step.uid === uid) {
                URL.revokeObjectURL(step.objectUrl); // free memory
            }
        });
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
                                <img src={step.objectUrl} alt="食譜圖片" className={styles.image} onLoad={() => clearMemory(step.uid)}></img>
                            </div>
                            <label htmlFor={step.uid} className={styles.label}>點擊上傳步驟照片</label>
                            <input type="file" accept="image/*" onChange={(e) => handleFile(e, step.uid)} className={styles.input} id={step.uid}></input>
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
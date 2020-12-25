import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

import Modal from "../Modal/Modal";
import styles from "./Steps.module.scss";
import defaultImg from "../../images/upload.png";



const Steps = ({ steps, setSteps }) => {
    const [ showDeleteModal, setShowDeleteModal ] = useState(false);

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
        setShowDeleteModal(false);
    }

    // 顯示預覽照片
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
    
    // 清除objectUrl記憶體
    const clearMemory = (uid) => {
        steps.forEach(step => {
            if(step.uid === uid) {
                URL.revokeObjectURL(step.objectUrl); 
            }
        });
    }

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    }



    return(
        <div className={styles.stepsContainer}>
            <div className={styles.text}>步驟<span>（至少一個步驟，步驟照片為選擇性上傳）</span></div>
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
                                <div className={styles.steptitle}>
                                    <div className={styles.stepNumber}>{index+1}.</div>
                                    {
                                        steps.length === 1 ?
                                        (<div className={styles.delete}>
                                            <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                                        </div>)
                                        :(<div className={styles.delete} onClick={toggleShowDeleteModal}>
                                            <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                                        </div>)
                                    }
                                </div>
                                <textarea placeholder="請輸入步驟說明（必填）" value={step.text} onChange={(e) => handleTextChange(e, step.uid)}></textarea>
                            </div>
                            {
                                showDeleteModal && 
                                <Modal text="確定要刪除此步驟？" handleCancel={toggleShowDeleteModal} handelConfirm={() => deleteStep(step.uid)}/>
                            }
                        </div>
                    )
                })
            }
            <button className={styles.button} onClick={addStep}>+ 新增步驟</button>
        </div>    
    )
}

export default Steps;
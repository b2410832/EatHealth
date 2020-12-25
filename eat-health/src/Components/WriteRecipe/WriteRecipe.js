import { useEffect, useState } from "react";
import firebase from "firebase/app";
import { db, storage } from "../../firebase";
import Select from "react-select";
import { useHistory } from "react-router-dom";

import UploadImage from "../UploadImage/UploadImage";
import Ingredients from "../Ingredients/Ingredients";
import Steps from "../Steps/Steps";
import Loading from "../Loading/Loading";
import Modal from "../Modal/Modal";
import Alert from "../Alert/Alert";
import styles from "./WriteRecipe.module.scss";
import foodDatabase from "../../foodDatabase.json";
import tipsBulb from "../../images/tips-bulb.svg";
import defaultImg from "../../images/upload.png"



// react-select options
// const options = foodDatabase.foods.map(food => ({ value: food.id, label: food.name, ...food }));
const recipeType = [{ value: 0, label: "均衡料理", name:"category"}, { value: 1, label: "減醣料理", name:"category"}, { value: 2, label: "增肌料理", name:"category"}];
const recipeTime = [{ value: 0, label: "早餐", name:"mealTime"}, { value: 1, label: "午晚餐", name:"mealTime"}, { value: 2, label: "點心", name:"mealTime"}];
const portion = [{ value: 0, label: "1", name: "portion"}, { value: 1, label: "2", name: "portion"}, { value: 2, label: "3", name: "portion"}, { value: 3, label: "4", name: "portion"}, { value: 4, label: "5", name: "portion"}, { value: 5, label: "6", name: "portion"}, { value: 6, label: "7", name: "portion"}, { value: 7, label: "8", name: "portion"}, { value: 8, label: "9", name: "portion"}, { value: 9, label: "10+", name: "portion"}];
const cookTime = [{ value: 0, label: "5", name: "cookTime"}, { value: 1, label: "10", name: "cookTime"}, { value: 2, label: "15", name: "cookTime"}, { value: 3, label: "20", name: "cookTime"}, { value: 4, label: "30", name: "cookTime"}, { value: 5, label: "45", name: "cookTime"}, { value: 6, label: "60", name: "cookTime"}, { value: 7, label: "90", name: "cookTime"}, { value: 8, label: "120+", name: "cookTime"}];


const WriteRecipe = ({user}) => {
  let history = useHistory();

  const [ inputs, setInputs ] = useState({ title: "", category: "", mealTime: "", summary: "", portion: "",cookTime: "", tips: ""});
  const [ ingredients, setIngredients ] = useState([{uid: `${new Date().getTime()}-1`, value:"", label:"", id:"",type:"", name:"",calorie:0, carb:0, protein:0, fat:0, qty:""}, {uid: `${new Date().getTime()}-2`, value:"", label:"", id:"",type:"", name:"",calorie:0, carb:0, protein:0, fat:0, qty:""}]);
  const [ steps, setSteps ] = useState([{uid: `${new Date().getTime()}-1`, text:"", imageUrl: null, objectUrl: defaultImg, file: null}, {uid: `${new Date().getTime()}-2`, text:"", imageUrl: null, objectUrl: defaultImg, file: null}, {uid: `${new Date().getTime()}-3`, text:"", imageUrl: null, objectUrl: defaultImg, file: null},])
  const [ file, setFile ] = useState(null); // 上傳到storage的主圖
  const [ url, setUrl ] = useState(null); // 從storage取得的url
  const [ isLoading, setIsLoading ] = useState(false);
  const [ showCancelModal, setShowCancelModal ] = useState(false); // 確認取消modal
  const [ showPostModal, setShowPostModal ] = useState(false); // 確認發布modal
  const [ showAlert, setShowAlert ] = useState(false); // 警告視窗
  const [ alertText, setAlertText ] = useState(""); // 警告視窗文字

  useEffect(() => {
    if(url) {
      postRecipe();
    }
  }, [url]);

  const handleInputChange = (e) => {
    setInputs({...inputs, [e.target.name]: e.target.value});
  }

  const handleSelectChange = (select) => {
    setInputs({...inputs, [select.name]: select.label});
  }

  const checkInput = () => {
    let { title, category, mealTime, summary, portion, cookTime, tips } = inputs;
    if(title.trim().length === 0) {
      setAlertText("請輸入食譜名稱");
      toggleAlert();
    } else if(category.trim().length === 0) {
      setAlertText("請選擇食譜分類");
      toggleAlert();
    } else if(mealTime.trim().length === 0) {
      setAlertText("請選擇適合時間");
      toggleAlert();
    } else if(!file) {
      setAlertText("請上傳食譜封面照片");
      toggleAlert();
    }else if(summary.trim().length === 0) {
      setAlertText("請輸入食譜描述");
      toggleAlert();
    } else if(portion.trim().length === 0) {
      setAlertText("請選擇份量");
      toggleAlert();
    } else if(cookTime.trim().length === 0) {
      setAlertText("請選擇烹調時間");
      toggleAlert();
    } else if(ingredients.some(i => i.label.trim().length === 0)) {
      setAlertText("食材請選填完整");
      toggleAlert();
    } else if(ingredients.some(i => i.qty.trim().length === 0)) {
      setAlertText("請輸入食材克數");
      toggleAlert();
    } else if(ingredients.some(i => isNaN(i.qty))) {
      setAlertText("食材克數請輸入數字");
      toggleAlert();
    } else if(steps.some(s => s.text.trim().length === 0)) {
      setAlertText("請輸入步驟說明");
      toggleAlert();
    } else if(tips.trim().length === 0) {
      setAlertText("請輸入食譜小叮嚀");
      toggleAlert();
    } else {
      setShowPostModal(true);
    }
  }

  const uploadImage = () => {
    setIsLoading(true);
    let promises = [];
    // 上傳每步驟的照片到storage > 得到url > setSteps
    steps.forEach(step => {
      if(step.file) {
        promises = [
          ...promises,
          storage.ref(`/recipeImages/${new Date().getTime()}-${step.file.name}`).put(step.file)
          .then(snapshot => snapshot.ref.getDownloadURL())
          .then(downloadURL => { 
            setSteps( prevSteps => prevSteps.map(prevStep => {
              if(prevStep.uid === step.uid) {
                return ({ ...prevStep, imageUrl: downloadURL })
              }
              return prevStep;
            }))
          })
        ]
      } 
    })
    // 上傳主圖到storage > 得到url > setUrl > useEffect觸發postRecipe
    Promise.all(promises).then(response => {
      storage.ref(`/recipeImages/${new Date().getTime()}-${file.name}`).put(file)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(downloadURL => { setUrl(downloadURL); });
    })
  };

  const postRecipe = () => {
    let newSteps = steps.map(step => {
      return ({ 
        uid: step.uid,
        imageUrl: step.imageUrl,
        text: step.text
      })
    })
    // 上傳最新的state到firestore
    let recipe = db.collection('recipes').doc();
      recipe.set({
        title: inputs.title,
        category: inputs.category,
        mealTime: inputs.mealTime,
        summary: inputs.summary,
        portion: inputs.portion,
        cookTime: inputs.cookTime,
        steps: newSteps,
        tips: inputs.tips,
        id: recipe.id,
        image: url,
        ingredients,
        createdTime: firebase.firestore.FieldValue.serverTimestamp(),
        authorId: user.uid,
        authorPhotoURL: user.photoURL,
        authorName: user.displayName,
    })
    setIsLoading(false);
    history.push(`/profile/${user.uid}/myRecipes`);
  }

  // 開啟/關閉取消modal
  const toggleCanceling = () => {
    setShowCancelModal(!showCancelModal);
  }
  // 取消modal點擊確認
  const confirmCancel = () => {
    history.push(`/profile/${user.uid}/myRecipes`);
  }
  // 開啟/關閉發布modal
  const togglePosting = () => {
    setShowPostModal(!showPostModal);
  }
  // 發布modal點擊確認
  const confirmPost = () => {
    uploadImage();
  }
  // alert點擊確認
  const toggleAlert = () => {
    setShowAlert(!showAlert);
  }
  
  if(isLoading) {
    return (
      <Loading />
    )
  } else {
    return (
      <div>
        <main className={styles.container}>
          <div>
            <div className={styles.text}>食譜名稱<span>（20字以內）</span></div>
            <input className={styles.input} name="title" value={inputs.title} onChange={handleInputChange} type="text" placeholder="請輸入食譜名稱（必填）"></input>
          </div>
          <div className={styles.flex}>
            <div className={styles.recipeType}>
              <div className={styles.text}>食譜分類</div>
              <Select options={recipeType} onChange={handleSelectChange} placeholder="請選擇...（必填）"/>
            </div>
            <div className={styles.recipeTime}>
              <div className={styles.text}>適合時間</div>
              <Select options={recipeTime} onChange={handleSelectChange} placeholder="請選擇...（必填）"/>
            </div>
          </div>
          <UploadImage 
            file={file} 
            setFile={setFile}      
          />
          <div>
            <div className={styles.text}>簡介</div>
            <textarea placeholder="請輸入食譜描述（必填，最多200字）" name="summary" value={inputs.summary} onChange={handleInputChange}></textarea>
          </div>
          <div className={styles.flex}>
            <div className={styles.portion}>
              <div className={styles.text}>份量<span>（人份）</span></div>
              <Select options={portion} onChange={handleSelectChange} placeholder="請選擇...（必填）"/>
            </div>
            <div className={styles.cookTime}>
              <div className={styles.text}>烹調時間<span>（分鐘）</span></div>
              <Select options={cookTime} onChange={handleSelectChange} placeholder="請選擇...（必填）"/>
            </div>
          </div>
          <Ingredients 
            // options={options} 
            ingredients={ingredients}
            setIngredients={setIngredients}
          />
          <Steps 
            steps={steps}
            setSteps={setSteps}
          />
          <div className={styles.tips}>
            <img src={tipsBulb} alt="小叮嚀" style={{width: "30px"}}/>
            <span className={styles.text}><mark>小叮嚀</mark></span>
            <textarea placeholder="請輸入食譜小叮嚀（必填）" name="tips" value={inputs.tips} onChange={handleInputChange}></textarea>
          </div>
          <div className={styles.flex}>
            <button className={styles.fullBtn} onClick={checkInput}>發布食譜</button>
            <button className={styles.lineBtn} onClick={toggleCanceling}>取消</button>
          </div>
        </main>
        {
          showCancelModal &&
          <Modal text={"確定要捨棄這次的編輯？"} handleCancel={toggleCanceling} handelConfirm={confirmCancel}/>
        }
        {
          showPostModal &&
          <Modal text={"確認要發布此篇食譜？"} handleCancel={togglePosting} handelConfirm={confirmPost}/>
        }
        {
          showAlert &&
          <Alert text={alertText} handelConfirm={toggleAlert}/>
        }
      </div>
    );
  }
}
export default WriteRecipe;
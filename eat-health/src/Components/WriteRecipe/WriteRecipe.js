import { useState } from "react";
import firebase from "firebase/app";
import { db, storage } from "../../firebase";
import Select from "react-select";
import { useHistory } from "react-router-dom";

import UploadImage from "../UploadImage/UploadImage";
import Ingredients from "../Ingredients/Ingredients";
import Steps from "../Steps/Steps";
import styles from "./WriteRecipe.module.scss";
import foodDatabase from "../../foodDatabase.json";
import tipsBulb from "../../images/tips-bulb.svg";
import defaultImg from "../../images/upload.png"



// react-select options
const options = foodDatabase.foods.map(food => ({ value: food.id, label: food.name, ...food }));
const recipeType = [{ value: 0, label: "均衡料理", name:"category"}, { value: 1, label: "減醣料理", name:"category"}, { value: 2, label: "增肌料理", name:"category"}];
const recipeTime = [{ value: 0, label: "早餐", name:"mealTime"}, { value: 1, label: "午晚餐", name:"mealTime"}, { value: 2, label: "點心", name:"mealTime"}];
const portion = [{ value: 0, label: "1", name: "portion"}, { value: 1, label: "2", name: "portion"}, { value: 2, label: "3", name: "portion"}, { value: 3, label: "4", name: "portion"}, { value: 4, label: "5", name: "portion"}, { value: 5, label: "6", name: "portion"}, { value: 6, label: "7", name: "portion"}, { value: 7, label: "8", name: "portion"}, { value: 8, label: "9", name: "portion"}, { value: 9, label: "10+", name: "portion"}];
const cookTime = [{ value: 0, label: "5", name: "cookTime"}, { value: 1, label: "10", name: "cookTime"}, { value: 2, label: "15", name: "cookTime"}, { value: 3, label: "20", name: "cookTime"}, { value: 4, label: "30", name: "cookTime"}, { value: 5, label: "45", name: "cookTime"}, { value: 6, label: "60", name: "cookTime"}, { value: 7, label: "90", name: "cookTime"}, { value: 8, label: "120+", name: "cookTime"}];


const WriteRecipe = ({user}) => {
  let history = useHistory();

  const [ inputs, setInputs ] = useState({ title: "", category: "", mealTime: "", summary: "", portion: "",cookTime: "",step1: "",step2: "",step3: "",step4: "",tips: ""});
  const [ ingredients, setIngredients ] = useState([{uid: `${new Date().getTime()}-1`, value:"", label:"", id:"",type:"", name:"",calorie:0, carb:0, protein:0, fat:0, qty:""}, {uid: `${new Date().getTime()}-2`, value:"", label:"", id:"",type:"", name:"",calorie:0, carb:0, protein:0, fat:0, qty:""}]);
  const [ steps, setSteps ] = useState([{uid: `${new Date().getTime()}-1`, text:"", image: ""}, {uid: `${new Date().getTime()}-2`, text:"", image: ""}, {uid: `${new Date().getTime()}-3`, text:"", image: ""}, {uid: `${new Date().getTime()}-4`, text:"", image: ""},])
  const [ file, setFile ] = useState(null);
  const [ url, setUrl ] = useState(defaultImg);
  const [ isLoading, setIsLoading ] = useState(false);

  const handleInputChange = (e) => {
    setInputs({...inputs, [e.target.name]: e.target.value});
  }

  const handleSelectChange = (select) => {
    setInputs({...inputs, [select.name]: select.label});
  }

  const handleSelectFoodChange = (foods, uid) => {
    setIngredients(ingredients.map(item => 
      item.uid === uid ? {...item, ...foods} : item
    ));
  }

  const handleQtyChange = (e, uid) => {
    setIngredients(ingredients.map(item => 
      item.uid === uid ? {...item, qty: e.target.value} : item
    ));
  }

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setUrl(URL.createObjectURL(e.target.files[0]));
  }

  const addIngredient = () => {
    const newIngredients = [...ingredients, {
      uid: `${new Date().getTime()}`, 
      value:"", label:"", 
      id:"",
      type:"", 
      name:"",
      calorie:0, 
      carb:0, 
      protein:0, 
      fat:0, 
      qty:"",
    }]
    setIngredients(newIngredients);
  }

  const deleteIngredient = (uid) => {
    setIngredients(ingredients.filter(item => item.uid !== uid));
  }

  const postRecipe = () => {
    if(file) {
      setIsLoading(true);
      const imageId = `${new Date().getTime()}-${file.name}` 
      const uploadTask = storage.ref(`/recipeImages/${imageId}`).put(file);
      return uploadTask.on('state_changed', console.log, console.error, () => {
        storage.ref("recipeImages").child(imageId).getDownloadURL()
          .then(url => {
              let recipe = db.collection('recipes').doc();
              recipe.set({
                title: inputs.title,
                category: inputs.category,
                mealTime: inputs.mealTime,
                summary: inputs.summary,
                portion: inputs.portion,
                cookTime: inputs.cookTime,
                steps,
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
            history.push("/recipes");
          })
      })
    } else {
      alert("請上傳照片");
    }
  };

  return (
    <main className={styles.container}>
      <div>
        <div className={styles.text}>食譜名稱<span>（20字以內）</span></div>
        <input className={styles.input} name="title" value={inputs.title} onChange={handleInputChange} type="text" placeholder="請輸入食譜名稱"></input>
      </div>
      <div className={styles.flex}>
        <div className={styles.recipeType}>
          <div className={styles.text}>食譜分類</div>
          <Select options={recipeType} onChange={handleSelectChange} placeholder="請選擇..."/>
        </div>
        <div className={styles.recipeTime}>
          <div className={styles.text}>適合時間</div>
          <Select options={recipeTime} onChange={handleSelectChange} placeholder="請選擇..."/>
        </div>
      </div>
      <UploadImage file={file} url={url} handleFile={handleFile}/>
      <div>
        <div className={styles.text}>簡介</div>
        <textarea placeholder="請輸入食譜描述（最多200字）" name="summary" value={inputs.summary} onChange={handleInputChange}></textarea>
      </div>
      <div className={styles.flex}>
        <div className={styles.portion}>
          <div className={styles.text}>份量<span>（人份）</span></div>
          <Select options={portion} onChange={handleSelectChange} placeholder="請選擇..."/>
        </div>
        <div className={styles.cookTime}>
          <div className={styles.text}>烹調時間<span>（分鐘）</span></div>
          <Select options={cookTime} onChange={handleSelectChange} placeholder="請選擇..."/>
        </div>
      </div>
      <Ingredients 
        options={options} 
        handleSelectFoodChange={handleSelectFoodChange} 
        handleQtyChange={handleQtyChange} 
        ingredients={ingredients}
        addIngredient={addIngredient}
        deleteIngredient={deleteIngredient}
      />
      <Steps 
        steps={steps}
        setSteps={setSteps}
      />
      <div className={styles.tips}>
        <img src={tipsBulb} alt="小叮嚀" style={{width: "30px"}}/>
        <span className={styles.text}><mark>小叮嚀</mark></span>
        <textarea placeholder="請輸入食譜小叮嚀" name="tips" value={inputs.tips} onChange={handleInputChange}></textarea>
      </div>
      <div className={styles.flex}>
        <button className={styles.fullBtn} onClick={postRecipe}>{isLoading ? "發布中..." : "發布食譜"}</button>
        <button className={styles.lineBtn}>取消</button>
      </div>
    </main>
  );
}
export default WriteRecipe;
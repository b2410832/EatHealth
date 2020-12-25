import { useState } from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

import styles from "./Ingredients.module.scss";
import Modal from "../Modal/Modal";
import foodDatabase from "../../foodDatabase.json";


const foods = foodDatabase.foods.map(food => ({ value: food.id, label: food.name, ...food }));

const Ingredients = ({ ingredients, setIngredients }) => {
    const [ showDeleteModal, setShowDeleteModal ] = useState();
    
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
        setShowDeleteModal(false);
    }

    const toggleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
    }
    

    return(
        <div>
            <div className={styles.text}>食材<span>（至少選擇一項）</span></div>
            { ingredients.map(ingredient => 
                (
                    <div className={styles.container} key={ingredient.uid}>
                        <Select 
                            className={styles.ingredient} 
                            options={foods} 
                            onChange={(e) => handleSelectFoodChange(e, ingredient.uid)} 
                            placeholder="請輸入食材名稱，例如：鮭魚"
                        />
                        <div className={styles.qty}>
                            <input 
                                className={styles.input} 
                                onChange={(e) => handleQtyChange(e, ingredient.uid)} 
                                value={ingredient.qty} 
                                type="text" 
                                placeholder="請輸入克數，例如：0.1" 
                            />
                            <div className={styles.grams}>公克</div>
                            {
                                ingredients.length === 1 ?
                                (<div className={styles.delete}>
                                    <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                                </div>)
                                : (<div className={styles.delete}>
                                    <FontAwesomeIcon icon={faTrashAlt} onClick={toggleShowDeleteModal}></FontAwesomeIcon>
                                </div>)
                            }
                        </div>
                        {
                            showDeleteModal && 
                            <Modal text="確定要刪除這道食材？" handleCancel={toggleShowDeleteModal} handelConfirm={() => deleteIngredient(ingredient.uid)}/>
                        }
                    </div>
                ))
            }
            <button className={styles.button} onClick={addIngredient}>+ 新增食材</button>
        </div>
    )
}

export default Ingredients;
import styles from './Ingredients.module.scss';
import Select from 'react-select';


const Ingredients = ({options, ingredients, setIngredients}) => {
    
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
      }
    

    return(
        <div>
            <div className={styles.text}>食材</div>
            { ingredients.map(ingredient => 
                (
                    <div className={styles.container} key={ingredient.uid}>
                        <Select 
                            className={styles.ingredient} 
                            options={options} 
                            onChange={(e) => handleSelectFoodChange(e, ingredient.uid)} 
                            placeholder="請選擇..."
                        />
                        <div className={styles.qty}>
                            <input 
                                className={styles.input} 
                                onChange={(e) => handleQtyChange(e, ingredient.uid)} 
                                value={ingredient.qty} 
                                type="text" 
                                placeholder="重量" 
                            />
                            <div className={styles.grams}>公克</div>
                            <div className={styles.delete} onClick={() => deleteIngredient(ingredient.uid)}></div>
                        </div>
                    </div>
                ))
            }
            <button className={styles.button} onClick={addIngredient}>+ 新增食材</button>
        </div>
    )
}

export default Ingredients;
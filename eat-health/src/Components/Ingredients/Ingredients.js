import styles from './Ingredients.module.scss';
import Select from 'react-select';


const Ingredients = ({options, handleSelectFoodChange, handleQtyChange, ingredients, addIngredient, deleteIngredient}) => {
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
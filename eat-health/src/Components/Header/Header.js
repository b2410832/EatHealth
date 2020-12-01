import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <div>Logo</div>
                <div className={styles.menu}>
                    <div>健康料理</div>
                    <div>減醣料理</div>
                    <div>增肌料理</div>
                </div>
            </div>
            <div className={styles.right}>
                <form className={styles.search}>
                    <FontAwesomeIcon icon={faSearch} style={{color:"#8a949f"}}/>
                    <input type="search" placeholder="今天想煮什麼？"></input>
                </form>
                <div className={styles.log}>登入</div>
                <div className={styles.log}>註冊</div>
                <button className={styles.fullBtn}>+ 寫食譜</button>
            </div>
        </header>
    )
}

export default Header;
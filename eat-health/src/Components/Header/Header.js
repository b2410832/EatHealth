import { BrowserRouter as Router, Switch, Route, Link, useHistory, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import styles from './Header.module.scss';
import { auth } from '../../firebase';


const Header = ({ user }) => {    
    let history = useHistory();

    const logout = () => {
        auth.signOut().then(function() {
            history.push("/");
          }).catch(function(error) {
            alert("登出失敗");
          });
    }

    const isActiveLink = (params) => {
        let urlParams = new URLSearchParams(window.location.search);
        let category = urlParams.get("category");
        return category === params;
    }

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <div className={styles.logo}>
                    <Link to="/">EatHealth</Link>
                </div>
                <div className={styles.menu}>
                    <div className={styles.link}>
                        <NavLink to="/recipes?category=all" activeClassName={styles.activeMenu} isActive={() => isActiveLink("all")}>所有料理</NavLink>
                    </div>
                    <div className={styles.link}>
                        <NavLink to="/recipes?category=balanced" activeClassName={styles.activeMenu} isActive={() => isActiveLink("balanced")}>均衡料理</NavLink>
                    </div>
                    <div className={styles.link}>
                        <NavLink to="/recipes?category=lowcarbs" activeClassName={styles.activeMenu} isActive={() => isActiveLink("lowcarbs")}>減醣料理</NavLink>
                    </div>
                    <div className={styles.link}>
                        <NavLink to="/recipes?category=highpt" activeClassName={styles.activeMenu} isActive={() => isActiveLink("highpt")}>增肌料理</NavLink>
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                {/* <form className={styles.search}>
                    <FontAwesomeIcon icon={faSearch} style={{color:"#8a949f"}}/>
                    <input type="search" placeholder="今天想煮什麼？"></input>
                </form> */}
                
                <Link to="/writeRecipe">
                    <button className={styles.fullBtn}>+ 寫食譜</button>
                </Link>
                {
                    user ?
                        <div style={{display: "flex"}}>
                            <div className={styles.profile}>
                                <img src={user.photoURL} alt="會員"></img>
                                <div>{user.displayName}</div>
                                <div className={styles.dropdown}>
                                    <Link to={`/profile/${user.uid}`}>
                                        <div className={styles.dropdownLink}>個人頁面</div>
                                    </Link>
                                    <Link to={`/profile/${user.uid}/favorites`}>
                                        <div className={styles.dropdownLink}>食譜收藏</div>
                                    </Link>
                                    <div className={styles.dropdownLink} onClick={logout}>登出</div>
                                </div>
                            </div>
                        </div>
                    : 
                    <div style={{display: "flex"}}>
                        <Link to="/login">
                            <div className={styles.log}>登入</div>
                        </Link>
                        <Link to="/signup">
                            <div className={styles.log}>註冊</div>
                        </Link>
                    </div>
                }
            </div>
        </header>
    )
}

export default Header;
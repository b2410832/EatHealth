import { Link, useHistory, NavLink } from "react-router-dom";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

import { logoutFromAuth } from "../../utils/firebase";
import styles from "./Header.module.scss";
import logo from "../../images/logo-full.png";

const Header = ({ user }) => {
  const [isExploring, setIsExploring] = useState(false);
  const [isSidenavOpen, setIsSidenavOpen] = useState(true);
  let history = useHistory();

  const menus = useRef();

  const logout = () => {
    logoutFromAuth(() => history.push("/"));
  };

  const isActiveLink = (params) => {
    let urlParams = new URLSearchParams(window.location.search);
    let category = urlParams.get("category");
    return category === params;
  };

  const toggleIsExploring = () => {
    isExploring
      ? (menus.current.style.top = "-10px")
      : (menus.current.style.top = "65px");
    setIsExploring(!isExploring);
  };

  const toggleIsSidenavOpen = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <Link to="/">
              <img src={logo} alt=""></img>
            </Link>
          </div>
          {isExploring ? (
            <div
              className={styles.explore}
              onMouseOver={toggleIsExploring}
              onMouseOut={toggleIsExploring}
              style={{ color: "#85bf3e" }}
            >
              找食譜 &nbsp;
              <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
            </div>
          ) : (
            <div
              className={styles.explore}
              onMouseOver={toggleIsExploring}
              onMouseOut={toggleIsExploring}
            >
              找食譜 &nbsp;
              <FontAwesomeIcon icon={faChevronUp}></FontAwesomeIcon>
            </div>
          )}
        </div>
        <div className={styles.right}>
          <Link to="/writeRecipe">
            <button className={styles.fullBtn}>+ 寫食譜</button>
          </Link>
          {user ? (
            <div style={{ display: "flex" }}>
              <div className={styles.profile}>
                <img src={user.photoURL} alt="會員"></img>
                <div>{user.displayName}</div>
                <div className={styles.dropdown}>
                  <Link to={`/profile/${user.uid}/myRecipes`}>
                    <div className={styles.dropdownLink}>個人頁面</div>
                  </Link>
                  <Link to={`/profile/${user.uid}/favorites`}>
                    <div className={styles.dropdownLink}>食譜收藏</div>
                  </Link>
                  <div className={styles.dropdownLink} onClick={logout}>
                    登出
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.member}>
              <Link to="/signup">
                <button className={styles.lineBtn}>註冊</button>
              </Link>
              <Link to="/login">
                <div className={styles.log}>登入</div>
              </Link>
            </div>
          )}
        </div>
        <div className={styles.burger} onClick={toggleIsSidenavOpen}>
          <FontAwesomeIcon icon={faBars} style={{ fontSize: "25px" }} />
        </div>
      </div>
      <div
        className={styles.bottom}
        ref={menus}
        onMouseOver={toggleIsExploring}
        onMouseOut={toggleIsExploring}
      >
        <div className={styles.menu}>
          <div className={styles.link}>
            <NavLink
              to="/recipes?category=all"
              activeClassName={styles.activeMenu}
              isActive={() => isActiveLink("all")}
            >
              全部料理
            </NavLink>
          </div>
          <div className={styles.link}>
            <NavLink
              to="/recipes?category=balanced"
              activeClassName={styles.activeMenu}
              isActive={() => isActiveLink("balanced")}
            >
              均衡料理
            </NavLink>
          </div>
          <div className={styles.link}>
            <NavLink
              to="/recipes?category=lowcarbs"
              activeClassName={styles.activeMenu}
              isActive={() => isActiveLink("lowcarbs")}
            >
              減醣料理
            </NavLink>
          </div>
          <div className={styles.link}>
            <NavLink
              to="/recipes?category=highpt"
              activeClassName={styles.activeMenu}
              isActive={() => isActiveLink("highpt")}
            >
              增肌料理
            </NavLink>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.menu}>
          <div className={styles.link}>
            <NavLink
              to="/recipes?category=all"
              activeClassName={styles.activeMenu}
              isActive={() => isActiveLink("all")}
            >
              全部料理
            </NavLink>
          </div>
          <div className={styles.link}>
            <NavLink
              to="/recipes?category=balanced"
              activeClassName={styles.activeMenu}
              isActive={() => isActiveLink("balanced")}
            >
              均衡料理
            </NavLink>
          </div>
          <div className={styles.link}>
            <NavLink
              to="/recipes?category=lowcarbs"
              activeClassName={styles.activeMenu}
              isActive={() => isActiveLink("lowcarbs")}
            >
              減醣料理
            </NavLink>
          </div>
          <div className={styles.link}>
            <NavLink
              to="/recipes?category=highpt"
              activeClassName={styles.activeMenu}
              isActive={() => isActiveLink("highpt")}
            >
              增肌料理
            </NavLink>
          </div>
        </div>
      </div>
      {isSidenavOpen && (
        <div className={styles.container}>
          <div className={styles.mask} onClick={toggleIsSidenavOpen}></div>
          <div className={styles.sidenavContainer}>
            {user ? (
              <div style={{ display: "flex" }}>
                <div className={styles.profile}>
                  <img src={user.photoURL} alt="會員"></img>
                  <div>{user.displayName}</div>
                  <div
                    className={styles.dropdown}
                    onClick={() => setIsSidenavOpen(false)}
                  >
                    <Link to={`/profile/${user.uid}/myRecipes`}>
                      <div className={styles.dropdownLink}>個人頁面</div>
                    </Link>
                    <Link to={`/profile/${user.uid}/favorites`}>
                      <div className={styles.dropdownLink}>食譜收藏</div>
                    </Link>
                    <div className={styles.dropdownLink} onClick={logout}>
                      登出
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.member}>
                <Link to="/signup">
                  <button className={styles.lineBtn}>註冊</button>
                </Link>
                <Link to="/login">
                  <div className={styles.log}>登入</div>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

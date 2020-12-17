import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { auth } from './firebase';

import Header from './Components/Header/Header';
import WriteRecipe from './Components/WriteRecipe/WriteRecipe';
import Footer from './Components/Footer/Footer';
import Home from "./Components/Home/Home";
import SignUp from "./Components/SignUp/SignUp";
import LogIn from "./Components/LogIn/LogIn";
import Recipes from "./Components/Recipes/Recipes";
// import RecipeList from "./Components/RecipeList/RecipeList";
import Recipe from "./Components/Recipe/Recipe";
import Profile from "./Components/Profile/Profile";
import PrivateRoute from "./PrivateRoute";
import styles from "./App.module.scss";


const App = () => {
  const [user, setUser] = useState(null);

  auth.onAuthStateChanged(function(user) {
    if (user) {
      console.log("user",auth.currentUser);
      setUser(auth.currentUser);
    } else {
      setUser(false);
    }
  });
  
  if(user===null) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        <h2 className={styles.h2}>Loading...</h2>
      </div>
    )
  } else {
    return (
        <div className={styles.container}>
          <div className={styles.content}>
            <Header user={user}/>
            <div className={styles.margin}></div>
            <Switch>
              <Route exact path="/" component={Home} />
              <PrivateRoute path="/writeRecipe" component={WriteRecipe} user={user} />
              <Route path="/signup" render={() => <SignUp setUser={setUser} user={user}/>} />
              <Route path="/login" render={() => <LogIn setUser={setUser}/>}/>
              <Route exact path="/recipes" render={() => <Recipes />}/>
              <Route path="/recipes/:recipeId" render={() => <Recipe user={user}/>}></Route>
              <Route path="/profile/:userId" render={() => <Profile user={user}/>}></Route>
            </Switch>
          </div>
          {/* <Footer /> */}
        </div>
    );
  }
}
export default App;
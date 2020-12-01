import { db } from './firebase';
import Header from './Components/Header/Header';
import WriteRecipe from './Components/WriteRecipe/WriteRecipe';
import Footer from './Components/Footer/Footer';



const App = () => {
    return (
      <div>
        <Header />
        <WriteRecipe />
        <Footer />
      </div>
    );
}
export default App;
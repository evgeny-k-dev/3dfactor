import logo from './logo.svg';
import './App.css';
import Menus from './components/Menus';
import Mockup from './components/Mockup';
import Modal3d from './components/Modal3d';

function App() {
  return (
    <div className="App">
      <header>
        <img src="svg/logo.svg" alt=""/>
        <div className="PersonalWrapper">
          <img src="svg/personals.svg" alt=""/>
          <p>Личный кабинет</p>
        </div>
      </header>
      <Modal3d shown3d={false}/>
      <div className="MainAppWrapper">
            <Mockup/>
            <Menus/>
        </div>
    </div>
  );
}

export default App;

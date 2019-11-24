import React from 'react';
import './scss/App.css';
import CreateForm from "./components/CreateForm";
import ProductsList from './components/ProductsList';

const App: React.FC = () => {
  return(
      <div className="App">
        <CreateForm language={'RU-ru'}/>
        <ProductsList language={'RU-ru'}/>
      </div>
  );
};

export default App;

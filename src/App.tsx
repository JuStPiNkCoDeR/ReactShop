import React from 'react';
import './App.css';
import CreateForm from "./components/CreateForm";

const App: React.FC = () => {
  return(
      <div className="App">
        <CreateForm language={'RU-ru'}/>
      </div>
  );
};

export default App;

import React from 'react';
import './scss/App.css';
import Head from './components/Head';
import CreateForm from "./components/CreateForm";
import ProductsList from './components/ProductsList';
import Socket from "./ts/Socket";

export type handleHeadOptionChange = (showProducts: boolean) => void;

interface IState {
    showProducts: boolean
}

export class App extends React.Component<any, IState>{
    constructor(props: any) {
        super(props);
        this.state = {
            showProducts: true
        }
    }

    private handleHeadChange: handleHeadOptionChange = (showProducts => {
        this.setState({
            showProducts: showProducts
        })
    });

    componentDidMount(): void {
        Socket.init();
    }

    render() {
      return(
          <div className="App">
              <Head language={'RU-ru'} handleChange={this.handleHeadChange}/>
              {this.state.showProducts ? (
                  <ProductsList language={'RU-ru'}/>) : (<CreateForm language={'RU-ru'}/>)
              }
          </div>
      );
  }
}

export default App;

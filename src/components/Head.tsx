import React from 'react';
import ILang from "../lang/ILang";
import Lang from '../lang';
import {handleHeadOptionChange} from "../App";

export interface IHeadProps {
    language: string,
    handleChange: handleHeadOptionChange
}

export class Head extends React.Component<IHeadProps> {
    private _langData: ILang;

    constructor(props: IHeadProps) {
        super(props);
        this._langData = Lang(props.language);
    }

    render() {
        return(
            <div className="head">
                <div className="showProducts" onClick={() => this.props.handleChange(true)}>
                    <p>{this._langData.head.showProducts}</p>
                </div>
                <div className="addNewProduct" onClick={() => this.props.handleChange(false)}>
                    <p>{this._langData.head.addNewProduct}</p>
                </div>
            </div>
        );
    }
}

export default Head;
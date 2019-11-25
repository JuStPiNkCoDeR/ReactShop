import React from 'react';
import ILang from "../lang/ILang";
import Lang from '../lang';
import SortProducts from './SortProducts';
import {HandleSortOptionsChange} from "./ProductsList";

export interface IOptionsProps {
    language: string,
    productsCount: number,
    handleChange: HandleSortOptionsChange
}

export class Options extends React.Component<IOptionsProps> {
    private _langData: ILang;

    constructor(props: IOptionsProps) {
        super(props);
        this._langData = Lang(props.language);
    }

    render() {
        return(
            <div className="optionsBlock blockContainer">
                <p className="productsAmount"><span>{this._langData.options.countOfProducts}</span>{this.props.productsCount}</p>
                <SortProducts handleChange={this.props.handleChange} language={this.props.language}/>
            </div>
        )
    }
}
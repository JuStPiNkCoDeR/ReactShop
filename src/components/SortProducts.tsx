import React from 'react';
import ILang from "../lang/ILang";
import Lang from '../lang';
import {EOptions, ExtraSortOptions} from './ExtraSortOptions';
import {ECurrency} from "../types";
import {HandleSortOptionsChange} from "./ProductsList";

export interface ISortProducts {
    language: string,
    handleChange: HandleSortOptionsChange
}

interface IStates {
    option: EOptions | null,
    price: IPriceConditions | null,
    currency: ECurrency | null
}

export interface IPriceConditions {
    from: number | null,
    to: number | null
}

export type PriceHandler = (conditions: IPriceConditions) => void;

export type CurrencyHandler = (condition: ECurrency | null) => void;

export class SortProducts extends React.Component<ISortProducts, IStates> {
    private _langData: ILang;
    private _handleChange: (e: React.FormEvent<HTMLSelectElement>) => void;

    constructor(props: ISortProducts) {
        super(props);
        this._langData = Lang(props.language);
        this._handleChange = this.handleChange.bind(this);
        this.state = {
            price: null,
            option: null,
            currency: ECurrency.Unknown
        }
    }

    private handleChange(event: React.FormEvent<HTMLSelectElement>) {
        let value = event.currentTarget.value as EOptions;

        this.setState({
            option: value
        })
    }

    private handlePriceChange: PriceHandler = (conditions: IPriceConditions) => {
        this.setState({
            price: conditions
        });

        this.props.handleChange({
            price: conditions,
            currency: this.state.currency
        });
    };

    private handleCurrencyChange: CurrencyHandler = (condition: ECurrency | null) => {
        this.setState({
            currency: condition
        });

        this.props.handleChange({
            price: this.state.price,
            currency: condition
        });
    };

    render() {
        return(
            <form className="sortProductsForm">
                <label htmlFor="sort-select" className="block">
                    {this._langData.options.sortTypes.sortBy}
                    <select id="sort-select" defaultValue={EOptions.All} onChange={this._handleChange}>
                        <option value={EOptions.All}>{this._langData.options.sortTypes.all}</option>
                        <option value={EOptions.Price}>{this._langData.options.sortTypes.price}</option>
                        <option value={EOptions.Currency}>{this._langData.options.sortTypes.currency}</option>
                    </select>
                    <ExtraSortOptions
                        language={this.props.language}
                        option={this.state.option}
                        handlePrice={this.handlePriceChange}
                        handleCurrency={this.handleCurrencyChange}/>
                </label>
            </form>
        )
    }
}

export default SortProducts;
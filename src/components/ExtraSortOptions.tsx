import React from 'react';
import ILang from "../lang/ILang";
import Lang from '../lang';
import { PriceHandler, CurrencyHandler } from './SortProducts';
import HTMLTricks from '../ts/HTMLTricks';
import {CurrencyEntities, ECurrency} from "../types";

export enum EOptions {
    Price = 'price', Currency = 'currency', All = 'all'
}

export interface IExtraSortOptions {
    language: string,
    option: EOptions | null,
    handlePrice: PriceHandler,
    handleCurrency: CurrencyHandler
}

interface IPriceOptionProps {
    language: string,
    handleChange: PriceHandler
}

interface ICurrencyOptionProps {
    language: string,
    handleChange: CurrencyHandler
}

interface IPriceState {
    from: number | null,
    to: number | null
}

class PriceOption extends React.Component<IPriceOptionProps, IPriceState> {
    private _langData: ILang;

    constructor(props: IPriceOptionProps) {
        super(props);
        this._langData = Lang(props.language);
        this.state = {
            from: null,
            to: null
        };
    }

    private handleChange(event: React.FormEvent<HTMLInputElement>, key: string) {
        if (key === 'from') {
            this.setState({
                from: parseInt(event.currentTarget.value)
            } as IPriceState);

            this.props.handleChange({
                from: parseInt(event.currentTarget.value),
                to: this.state.to
            })
        } else if (key === 'to') {
            this.setState({
                to: parseInt(event.currentTarget.value)
            });

            this.props.handleChange({
                from: this.state.from,
                to: parseInt(event.currentTarget.value)
            })
        }
    }

    render() {
        return(
            <span>
                <label htmlFor="price-from">
                    {this._langData.options.sortTypes.from}
                    <input id="price-from" type="number" min={0} onChange={(e: React.FormEvent<HTMLInputElement>) => this.handleChange(e, 'from')}/>
                </label>
                <label htmlFor="price-to">
                    {this._langData.options.sortTypes.to}
                    <input id="price-to" type="number" min={0} onChange={(e: React.FormEvent<HTMLInputElement>) => this.handleChange(e, 'to')}/>
                </label>
            </span>
        )
    }
}

class CurrencyOption extends React.Component<ICurrencyOptionProps> {
    private _langData: ILang;
    private _handleChange: (e: React.FormEvent<HTMLSelectElement>) => void;

    constructor(props: ICurrencyOptionProps) {
        super(props);
        this._langData = Lang(props.language);
        this._handleChange = this.handleChange.bind(this);
    }

    private handleChange(event: React.FormEvent<HTMLSelectElement>) {
        this.props.handleChange(event.currentTarget.value as ECurrency);
    }

    render() {
        return(
            <span>
                <label htmlFor="sort-currency">
                    {this._langData.options.sortTypes.chooseCurrency}
                    <select id="sort-currency" defaultValue={ECurrency.Unknown} onChange={this._handleChange}>
                        <option value={ECurrency.Unknown}>{this._langData.options.sortTypes.all}</option>
                        <option value={ECurrency.Ruble}>{HTMLTricks.entityToChar(CurrencyEntities[ECurrency.Ruble])}</option>
                        <option value={ECurrency.Dollar}>{HTMLTricks.entityToChar(CurrencyEntities[ECurrency.Dollar])}</option>
                        <option value={ECurrency.Euro}>{HTMLTricks.entityToChar(CurrencyEntities[ECurrency.Euro])}</option>
                    </select>
                </label>
            </span>
        )
    }
}

export class ExtraSortOptions extends React.Component<IExtraSortOptions> {
    private _langData: ILang;

    constructor(props: IExtraSortOptions) {
        super(props);
        this._langData = Lang(props.language);
    }

    render() {
        return(
            <span>
                {this.props.option === EOptions.Price && (
                    <PriceOption language={this.props.language} handleChange={this.props.handlePrice}/>
                )}
                {this.props.option === EOptions.Currency && (
                    <CurrencyOption language={this.props.language} handleChange={this.props.handleCurrency}/>
                )}
            </span>
        )
    }
}

export default ExtraSortOptions;
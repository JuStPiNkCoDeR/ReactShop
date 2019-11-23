import React from 'react';
import Lang from '../lang';
import ILang from "../lang/ILang";
import { IIdentifiedProperty, GetPropertyValueEvent } from './ProductPropertiesField';

export interface IProductPropertyProps {
    language: string,
    sendValue: GetPropertyValueEvent,
    id: number
}

enum StateKeys {
    PropertyName = "propertyName",
    PropertyValue = "propertyValue"
}

type ChangeHandler = (event: React.FormEvent<HTMLInputElement>, key: StateKeys) => void;

interface IStates {
    [StateKeys.PropertyName]: string,
    [StateKeys.PropertyValue]: string
}

export class ProductProperty extends React.Component<IProductPropertyProps, IStates> {
    private _langData: ILang;
    private readonly _handleChange: ChangeHandler;
    constructor(props: IProductPropertyProps) {
        super(props);
        this._langData = Lang(props.language);
        this._handleChange = this.handleChange.bind(this);
        this.state = {
            propertyName: '',
            propertyValue: ''
        }
    }

    private handleChange(event: React.FormEvent<HTMLInputElement>, key: StateKeys): void {
        let currentState = Object.create(this.state) as IStates;
        currentState[key] = event.currentTarget.value;
        this.setState(currentState);

        if (key === StateKeys.PropertyName) {
            this.props.sendValue({
                id: this.props.id,
                name: currentState[StateKeys.PropertyName],
                value: this.state[StateKeys.PropertyValue]
            } as IIdentifiedProperty)
        } else {
            this.props.sendValue({
                id: this.props.id,
                name: this.state[StateKeys.PropertyName],
                value: currentState[StateKeys.PropertyValue]
            } as IIdentifiedProperty)
        }

    }

    private getId(type: string) {
        return `property-${type}-field-${this.props.id}`;
    }

    render() {
        return(
            <span className="container column property">
                <label htmlFor={this.getId('name')}>
                    {this._langData.form.product.propertyField.propertyName}
                    <input id={this.getId('name')} type="text" placeholder={this._langData.form.product.propertyField.writePropertyName} onChange={(e) => this._handleChange(e, StateKeys.PropertyName)}/>
                </label>
                <label htmlFor={this.getId('value')}>
                    {this._langData.form.product.propertyField.propertyValue}
                    <input id={this.getId('value')} type="text" placeholder={this._langData.form.product.propertyField.writePropertyValue} onChange={(e) => this._handleChange(e, StateKeys.PropertyValue)}/>
                </label>
            </span>
        );
    }

}
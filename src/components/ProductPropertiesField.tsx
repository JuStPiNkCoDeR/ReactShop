import React from 'react';
import { ProductProperty } from "./ProductProperty";
import ILang from "../lang/ILang";
import Lang from '../lang';
import { onPropertiesChange } from './CreateForm';

export type AddPropertyHandler = () => void;

export type GetPropertyValueEvent = (property: IIdentifiedProperty) => void;

export interface IProductPropertiesFieldProps {
    language: string,
    onChangeHandler: onPropertiesChange
}

enum StateKeys {
    Properties = "Properties",
    Values = "Values"
}

interface IStates {
    [StateKeys.Properties]: Array<JSX.Element>,
    [StateKeys.Values]: Array<IIdentifiedProperty>
}

export interface IIdentifiedProperty {
    id: number,
    name: string,
    value: string
}

export class ProductPropertiesField extends React.Component<IProductPropertiesFieldProps, IStates> {
    private _langData: ILang;
    constructor(props: IProductPropertiesFieldProps) {
        super(props);
        this._langData = Lang(props.language);
        this.state = {
            [StateKeys.Properties]: [],
            [StateKeys.Values]: []
        };
    }

    private handleAddProperty: AddPropertyHandler = () => {
        let currentProperties = this.state[StateKeys.Properties];
        currentProperties.push(<ProductProperty language={this.props.language} key={this.state[StateKeys.Properties].length} id={this.state[StateKeys.Properties].length} sendValue={this.getValues}/>);
        this.setState({
            [StateKeys.Properties]: currentProperties
        } as IStates);
    };

    componentDidMount(): void {
        this.handleAddProperty();
    }

    private getValues: GetPropertyValueEvent = (property) => {
        let currentState = Object.create(this.state) as IStates;
        currentState[StateKeys.Values][property.id] = property;
        this.setState(currentState);

        this.props.onChangeHandler(currentState[StateKeys.Values]);
    };

    render() {
        const properties = this.state[StateKeys.Properties]!;
        return(
            <div className="container column">
                {this._langData.form.product.propertyField.root}
                <span className="property" onClick={(e) => this.handleAddProperty()}>{this._langData.form.product.propertyField.addNewProperty}</span>
                {properties.map((property) => property)}
            </div>
        )
    }
}
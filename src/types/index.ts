export enum ECurrency {
    Ruble = "Ruble",
    Dollar = "Dollar",
    Euro = "Euro",
    Unknown = "Unknown"
}

export const CurrencyEntities = {
    [ECurrency.Ruble]: "&#x20bd;",
    [ECurrency.Dollar]: "&#x24;",
    [ECurrency.Euro]: "&#8364;"
};

export interface IProperty {
    name: string,
    value: string | number
}

export enum EProductKeys {
    Name = 'name', Price = 'price', Currency = 'currency', Description = 'description',
    Properties = 'properties', Pictures = 'pictures'
}
export interface IProduct {
    name: string,
    price: number,
    currency: ECurrency,
    description: string,
    properties: Array<IProperty>,
    posted?: Date | null,
    pictures: Array<File>
}

export class Product {
    private _name: string;
    private _price: number;
    private _currency: ECurrency;
    private _description: string;
    private _properties: Array<IProperty>;

    constructor(props: IProduct) {
        this._name = props.name;
        this._price = props.price;
        this._currency = props.currency;
        this._description = props.description;
        this._properties = props.properties;
    }


}
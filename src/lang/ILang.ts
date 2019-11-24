export default interface ILang {
    form: {
        product: {
            name: string,
            writeName: string,
            price: string,
            writePrice: string,
            currency: string,
            description: string,
            writeDescription: string,
            pictures: string,
            putPictures: string,
            submit: string,
            propertyField: {
                root: string
                propertyName: string,
                propertyValue: string,
                writePropertyName: string,
                writePropertyValue: string,
                addNewProperty: string
            }
        }
    },
    options: {
        countOfProducts: string,
        sortTypes: {
            from: string,
            to: string,
            sortBy: string,
            all: string,
            price: string,
            date: string,
            currency: string,
            chooseCurrency: string
        }
    },
    productsList: {
        product: {
            price: string,
            date: string,
            unknown: string,
            properties: string,
            description: string
        }
    }
}
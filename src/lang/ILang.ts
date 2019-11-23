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
    }
}
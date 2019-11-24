import ILang from "./ILang";

const data: ILang = {
    form: {
        product: {
            name: "Наименование продукта",
            writeName: "Введите наименование продукта",
            price: "Стоимость продукта",
            writePrice: "Введите стоимость продукта",
            description: "Описание продукта",
            writeDescription: "Введите описание продукта",
            currency: "Валюта",
            pictures: "Изоражения продукта",
            putPictures: "Перетащите или кликните здесь для загрузки изображений",
            submit: "Добавить товар",
            propertyField: {
                root: "Свойства",
                propertyName: "Наименование",
                propertyValue: "Значение",
                writePropertyName: "Введите название свойства",
                writePropertyValue: "Введите значение свойства",
                addNewProperty: "Добавить новое свойство"
            }
        }
    },
    options: {
        countOfProducts: "Количество товаров по вашим требованиям",
        sortTypes: {
            from: "от",
            to: "до",
            sortBy: "Показать",
            all: "Все",
            price: "По цене",
            currency: "По валюте",
            date: "По дате",
            chooseCurrency: "Валюта"
        }
    },
    productsList: {
        product: {
            price: "Стоимость",
            date: "Продается с",
            unknown: "Неизвестно",
            description: "Описание",
            properties: "Свойства"
        }
    },
    head: {
        showProducts: "Показать все товары",
        addNewProduct: "Добавить новый товар"
    }
};

export default data;
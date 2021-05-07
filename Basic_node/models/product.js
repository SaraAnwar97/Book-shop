const products = [];
module.exports = class Product {
    constructor(title){
        this.title=title;

    }

    save() {
        products.push(this); // this:refers to object created based on that class
    }

    static fetchAll() {
        return products; // static method directly called on class not on an instantiated object

    }
}

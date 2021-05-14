const getDb= require('../util/database').getDb;

class Product {
    constructor(title, imageUrl , description  , price){
        this.title=title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;

    }

    save() {
     const db = getDb();
    //connecting db to products connection
     return db.collection('products').insertOne(this)
     .then(result =>{
        console.log(result);
     })
     .catch(err =>{
        console.log(err);
     }); 
    }
}

module.exports = Product;
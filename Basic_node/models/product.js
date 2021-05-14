const mongodb = require('mongodb');
const getDb= require('../util/database').getDb;

class Product {
    constructor(title, imageUrl , description  , price){
        this.title=title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;

    }

    save() {
     const db = getDb(); //getting access to db
    //connecting db to products connection
    //.insertOne() returns a promise
     return db.
     collection('products').
     insertOne(this)
     .then(result =>{
        console.log(result);
     })
     .catch(err =>{
        console.log(err);
     }); 
    }

    static fetchAll(){
        const db = getDb();
        //.find() returns a cursor
        return db
        .collection('products')
        .find()
        .toArray()
        .then(products =>{
            console.log(products);
            return products;
         })
         .catch(err =>{
            console.log(err);
         });
    }

    static findById(prodId){
      const db = getDb();
      return db
      .collection('products')
      .find({_id : new mongodb.ObjectId(prodId)})
      .next() //returns next and last doc returned by find()
      .then(product =>{
         console.log(product);
         return product;
      })
      .catch(err =>{
         console.log(err);
      });

    }
}

module.exports = Product;
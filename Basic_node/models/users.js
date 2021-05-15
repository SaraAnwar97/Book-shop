const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
class User{
    constructor(username,email,cart,id){
        this.name = username;
        this.email = email;
        this.cart = cart; //{items: []}
        this._id = id;
    }

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product){
        //product.quantity = 1; //adding a field on the fly
        //(...product)pulling out all properties in product
const updatedCart = { items:[{productId: new ObjectId(product._id), quantity: 1}]} ;
const db = getDb();
return db
.collection('users')
.updateOne(
    { _id: new ObjectId(this._id) },
    { $set: {cart: updatedCart} }
    );
    }

    static findById(userId){
        const db = getDb();
        return db
        .collection('users')
        .find({ _id : new ObjectId(userId)})
        .next()
        .then(user=>{
            console.log(user);
            return user;
        })
        .catch(err=>{
            console.log(err);
        });
    }
}

module.exports = User;

const getDb= require('../util/database').getDb;

module.exports = class Product {
    constructor(id,title, imageUrl , description  , price){
        this.id = id;
        this.title=title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;

    }

    save() {
        getProductsFromFile(products =>{
            if(this.id){
            const existingProductIndex = products.findIndex(prod => prod.id === this.id);
            const updateProducts = [...products];
            updateProducts[existingProductIndex] = this;
            fs.writeFile(p,JSON.stringify(updateProducts), (err)=>{
                console.log(err);
            });
        }else{ // creating a new product
            this.id = Math.random().toString();//adding a unique id to each product
            products.push(this);
            //.stringify(): takes js obj/ arr , converts it into Json 
            fs.writeFile(p,JSON.stringify(products), (err)=>{
                console.log(err);
        });
        }
        });
    }

    static Delete(id) {
        getProductsFromFile(products =>{
            const product=products.find(prod=> prod.id === id)
            const updatedProducts = products.filter(p => p.id !== id );//filter returns a new arr with product's ids != entered id
            fs.writeFile(p,JSON.stringify(updatedProducts),err =>{
            if(!err){
            cart.deleteProduct(id,product.price);
            }
            });
        });
    }

 

    static fetchAll(cb) {
       getProductsFromFile(cb);
       
    }

    static findById(id,cb){
        getProductsFromFile(products =>{
            const product = products.find(p => p.id === id ); //searches every element in the arr and returns element with val true
            cb(product);
        });
    }



};

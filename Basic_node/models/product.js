const fs = require('fs');
const path = require('path');
const p  = path.join(path.dirname(process.mainModule.filename),
'data', 
'products.json');
const getProductsFromFile = cb =>{
        fs.readFile(p,(err,fileContent)=>{
        if(err){
            return cb([]);
        }else{
        cb(JSON.parse(fileContent)); // return file content as an array
        }

});
};

module.exports = class Product {
    constructor(title, imageUrl , description  , price){
        this.title=title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;

    }

    save() {
        this.id = Math.random().toString();//adding a unique id to each product
        getProductsFromFile(products =>{
            products.push(this);
            //.stringify(): takes js obj/ arr , converts it into Json 
            fs.writeFile(p,JSON.stringify(products), (err)=>{
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
       getProductsFromFile(cb);
       
    }
}

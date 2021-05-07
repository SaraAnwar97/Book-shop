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
    constructor(title){
        this.title=title;

    }

    save() {
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

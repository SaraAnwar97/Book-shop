const fs = require('fs');
const path = require('path');
module.exports = class Product {
    constructor(title){
        this.title=title;

    }

    save() {
        const p  = path.join(path.dirname(process.mainModule.filename),
         'data', 
         'products.json');

        // read whole file at path p and either get an error or file content
        fs.readFile(p,(err,fileContent) => {
            let products = [];
            if(!err){
                products = JSON.parse(fileContent); // .parse():takes incoming Json and returns arr/ object/ file content

            }
            products.push(this);
            //.stringify(): takes js obj/ arr , converts it into Json 
            fs.writeFile(p,JSON.stringify(products), (err)=>{
                console.log(err);
            });
        }); 
    }

    static fetchAll(cb) {
        const p  = path.join(path.dirname(process.mainModule.filename),
         'data', 
         'products.json');
        fs.readFile(p,(err,fileContent)=>{
        if(err){
            cb([]);
        }
        cb(JSON.parse(fileContent)); // return file content as an array

        });
       
    }
}

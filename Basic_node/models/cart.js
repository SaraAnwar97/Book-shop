const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  // we don't need to recreate a cart for every product , there will always be a cart
/*constructor(){
    this.products = [];
    this.totalPrice = 0;

}*/
  static addProduct(id, productPrice) {
    // Fetch prev cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) { //we got an existing cart , cart should have the parsed file content
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart (find existing prod)
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct }; // new obj with prev product properties
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;  //replaced prev product with updated product
      } else {
        updatedProduct = { id: id, qty: 1 }; // new obj
        cart.products = [...cart.products, updatedProduct]; // arr with all prev cart products + new product
      }
      cart.totalPrice = cart.totalPrice + +productPrice; //(+ converts str to num)
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

static deleteProduct(id,productPrice){
  fs.readFile(p,(err,fileContent)=>{
    if(err){ //didn't find a cart , nothing to delete
      return;
    }
    const updatedCart = {...JSON.parse(fileContent)};
    const product= updatedCart.products.find(prod => prod.id === id);
    const productQty = product.qty;
    updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
    updatedCart.totalPrice = updatedCart.totalPrice - productPrice*productQty;
    fs.writeFile(p,JSON.stringify(updatedCart),err =>{
      console.log(err);
    });
  });

};


static getCart(cb){
fs.readFile(p,(err,fileContent)=>{
  const cart = JSON.parse(fileContent);
  if(err){
    cb(null);
  }else{
  cb(cart);
  }
});
}

};

const deleteProduct = (btn) =>{
//console.log('clicked');
console.log(btn.parentNode.querySelector('[name = productId]').value);
const csrf = btn.parentNode.querySelector('[name = _csrf]').value;
};
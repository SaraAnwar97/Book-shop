const deleteProduct = (btn) =>{
    //console.log('clicked');
    const prodId = btn.parentNode.querySelector('[name = productId]').value;
    const csrf = btn.parentNode.querySelector('[name = _csrf]').value;
    // /product/productId
    fetch('/admin/product-list/' + prodId, {
        method: "DELETE",
        headers:{
            'csrf-token' : csrf
        }
    }).then(result=>{
        console.log(result);
    }).catch(err =>{
        console.log(err);
    });
    };
const fs = require('fs');
const { deleteOne } = require('../models/product');

const deleteFile = (filePath) =>{
    fs.unlink(filePath,(err) =>{
        if(err){
            throw(err);
        }
    });
}
exports.deleteFile = deleteFile;
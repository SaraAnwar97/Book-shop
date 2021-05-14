const mongodb = require('mongodb'); //acessing mongodb package
const mongoClient = mongodb.MongoClient; // extracting client constructor

let _db; //used internally in this file;
const mongoConnect =(callback)=>{
    const url = 'mongodb+srv://Sara:Ss4923@@@cluster0.ldpfv.mongodb.net/shop?retryWrites=true&w=majority';
    mongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('connected');
       _db = client.db();//storing connection to db to keep running
        callback(); 
    })
    .catch(err =>{
        console.log(err);
        throw err;
    }); //connecting client to db
};
const getDb = () =>{
if(_db){
    return _db;
}
throw 'No database found'
}; // returning access to connected db if it exists

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
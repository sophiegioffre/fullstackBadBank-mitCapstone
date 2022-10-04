const MongoClient = require('mongodb').MongoClient;
//const url = 'mongodb://localhost:27017';
//const uri = "mongodb+srv://sophiegioff:89Piggish@bankingappcluster.wrutvnw.mongodb.net/?retryWrites=true&w=majority";
const uri = process.env.MONGODB_URI;
// connect to mongo
MongoClient.connect(uri, {useUnifiedTopology: true}, function(err, client) {
  console.log("Connected successfully to server");

    // database Name
    const dbName = 'fullstackBadBankDB';
    const db = client.db(dbName);

    // new user
    var name = 'user' + Math.floor(Math.random()*10000);
    var email = name + '@mit.edu';

    // insert into customer table
    var collection = db.collection('customers');
    var doc = {name, email};
    collection.insertOne(doc, {w:1}, function(err, result) {
        console.log('Document insert');
    });

    var customers = db
        .collection('customers')
        .find()
        .toArray(function(err, docs) {
            console.log('Collection:',docs);

            // clean up
            client.close();            
    });    

});

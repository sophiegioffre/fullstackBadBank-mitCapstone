const { MongoClient } = require('mongodb');

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://sophiegioff:89Piggish@bankingappcluster.wrutvnw.mongodb.net/?retryWrites=true&w=majority";
 

    const client = new MongoClient(uri, {useUnifiedTopology: true} );
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        await  listDatabases(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
 





// const MongoClient = require('mongodb').MongoClient;
// const url = 'mongodb://localhost:27017';
 
// // connect to mongo
// MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
//   console.log("Connected successfully to server");

//     // database Name
//     const dbName = 'fullstackBadBankDB';
//     const db = client.db(dbName);

//     // new user
//     var name = 'user' + Math.floor(Math.random()*10000);
//     var email = name + '@mit.edu';

//     // insert into customer table
//     var collection = db.collection('customers');
//     var doc = {name, email};
//     collection.insertOne(doc, {w:1}, function(err, result) {
//         console.log('Document insert');
//     });

//     var customers = db
//         .collection('customers')
//         .find()
//         .toArray(function(err, docs) {
//             console.log('Collection:',docs);

//             // clean up
//             client.close();            
//     });    

// });

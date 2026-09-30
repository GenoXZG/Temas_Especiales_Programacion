import mongo from 'mongodb'
const {MongoClient} = mongo;

const url = 'mongodb://localhost:27017/';
const dbName = "pizzeria";
const client = new MongoClient(url);

export function obtenerDb() {
    return client.db(dbName);
}

const MongoClient = require("mongodb").MongoClient
const chalk = require('chalk')

module.exports = async function initDB(url, dbName){
	
	const mongoClient = new MongoClient(url, { useUnifiedTopology: true })

	const client = await mongoClient.connect()

	const db = client.db(dbName)

	console.log(chalk.green(`Success connected to ${dbName}`))

	return db
}
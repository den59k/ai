require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const chalk = require('chalk')

const initDB = require('./db')
const webListRouter = require('./routers/web-list')

const port = process.env.PORT

async function init (){

	const app = express()
	app.use(bodyParser.json())

	const db = await initDB(process.env.DB_URL, process.env.db_NAME)

	//Подключаем все роутеры
	webListRouter(app, db)

	app.listen(port, () => console.log(chalk.green(`Success server started at http://localhost:${port}`)))
}

init()
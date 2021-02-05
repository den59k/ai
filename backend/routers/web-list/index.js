const router = require('express').Router()

const initModel = require('./model')

module.exports = function (app, db) {

	const { getWebList, getWeb, updateWeb, addWeb } = initModel(db)

	router.get('/', async (req, res) => {
		const list = await getWebList()
		res.json(list)
	})

	router.get('/:id', async (req, res) => {
		const id = req.params.id
		const web = await getWeb(id)
		res.json(web)
	})

	router.put('/:id', async (req, res) => {
		const id = req.params.id
		const { data } = req.body
		const resp = await updateWeb(id, data)
		res.json(resp)
	})

	router.post('/', async (req, res) => {
		const { name, data } = req.body
		const resp = await addWeb(name, data)
		res.json(resp)
	})
	
	app.use('/api', router)
}
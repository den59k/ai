const ObjectID = require('mongodb').ObjectID

module.exports = function(db){

	const collection = db.collection('webs')

	const getWebList = async () => {
		const resp = await collection.find({}, { projection: { data: 0 }, sort: { timestep: -1 } }).toArray()
		return resp
	}

	const getWeb = async (id) => {
		const _id = new ObjectID(id)
		const resp = await collection.findOne({ _id })
		return resp
	}

	const updateWeb = async (id, data) => {
		const _id = new ObjectID(id)
		const resp = await collection.updateOne({_id}, { $set: { data } })
		return { count: resp.modifiedCount }
	}

	const addWeb = async (name, data) => {
		const countNeurons = Object.keys(data.neurons).length
		const countEdges = Object.keys(data.edges).length
		const resp = await collection.insertOne({ name, data, countNeurons, countEdges, timestep: Date.now() })
		return { count: resp.insertedCount }
	}

	return { getWebList, getWeb, addWeb, updateWeb }
}
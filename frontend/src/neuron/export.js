import { Map, OrderedMap } from 'immutable'
import { setAutoKey } from './tools'

export function stateToJson (state) {
	const neurons = state.get('neurons').toObject()
	const edges = state.get('edges').toObject()
	const type = state.get('type')
	return ({ neurons, edges, type })
}

export function jsonToState (json) {

	const neurons = Object.keys(json.neurons).map(key => {
		const intKey = parseInt(key)
		return [ intKey, new Map(json.neurons[key]) ]
	})

	const edges = Object.keys(json.edges).map(key => [ key, new Map(json.edges[key]) ])

	const state = new Map({
		neurons: new OrderedMap(neurons),				//Каждый нейрон имеет уникальный ключ
		edges: new Map(edges),									//Содержит набор связей между нейронами
		type: json.type || "step",
		selected: null,
		draftEdge: null
	})

	setAutoKey(state)

	return state
}
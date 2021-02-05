import { Map, OrderedMap } from 'immutable'

export function createNeuronState (){
	return new Map({
		neurons: new OrderedMap(),				//Каждый нейрон имеет уникальный ключ
		edges: new Map(),									//Содержит набор связей между нейронами
		type: "step",
		selected: null,
		draftEdge: null
	})
}
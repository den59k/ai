import { Map } from 'immutable'

export default function computeStep (neurons, edges, values){

	let _edges = edges
	let roots = neurons				//Массив вершин, которые только испускают нейроны

	_edges.forEach(edge => roots = roots.delete(edge.get('to')))			//Выбираем только вершины, в которые не входят вершины
	let _values = values.merge(roots.map(neuron => neuron.get('weight')))
	let visibleValues = new Map()

	for(let i = 0; i < 10; i++){
		let newValues = new Map()
		_edges.forEach(edge => {
			const value = _values.get(edge.get('from'))

			if(typeof(value) === 'number')
				newValues = newValues.set(edge.get('to'), (newValues.get(edge.get('to')) || 0) + value * edge.get('weight'))
		})

		visibleValues = visibleValues.merge( newValues.filter((value, key) => !visibleValues.has(key) || value > visibleValues.get(key)) )
		_values = newValues.map((value, key) => value > neurons.get(key).get('weight')? 1: 0)
	}

	return { values: _values, visibleValues }
	
}
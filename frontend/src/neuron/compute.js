import { Map } from 'immutable'

export default function computeValues (neurons, edges, type){

	let _edges = edges
	let values = new Map()				//Массив весов для вычислений
	let _values = new Map()				//Массив весов для отображения

	let remaining = neurons
	let mas = neurons				//Массив вершин, которые только испускают нейроны
	_edges.forEach(edge => mas = mas.delete(edge.get('to')))			//Выбираем только вершины, в которые не входят вершины
	
	mas.forEach((neuron, key) => {
		values = values.set(key, neuron.get('weight'))			//Задаем начальное значение вершинам
	})

	let counter = 0

	while(_edges.size > 0 || counter > 10){

		_edges.forEach(edge => {
			if(mas.has(edge.get('from'))) 			//Далее мы складываем значения со всеми вершинками
				values = values.set(edge.get('to'), (values.get(edge.get('to')) || 0) + values.get(edge.get('from')) * edge.get('weight'))			
		})

		_edges = _edges.filter(edge => !mas.has(edge.get('from')))			//И удаляем эти ребра

		mas = remaining = remaining.deleteAll(mas.keySeq())
		_edges.forEach(edge => mas = mas.delete(edge.get('to')))			//Выбираем только вершины, в которые не входят вершины

		mas.forEach((_, key) => {
			_values = _values.set(key, values.get(key))
		})

		values = values.map((val, key) => {
			if(!mas.has(key)) return val
			const res = val - neurons.get(key).get('weight')
			if(type === 'step' && res > 0) return 1
			if(type === 'linear'){
				//if(res > 1) return 1
				if(res > 0) return res
			}

			return 0
		})
		
		counter ++
	}

	return _values
}
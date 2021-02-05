import { Map } from 'immutable'
import { add } from 'mathjs'

let counter = 1000

export function genKey (){
	return counter++
}

export function setAutoKey (state){
	const max = state.get('neurons').keySeq().last()
	counter = max+1
}

export function addNeuron (state, position, key){
	const newNeuron = new Map({
		position,
		weight: 0
	})
	return state.set( 'neurons', state.get('neurons').set(key? key: genKey(), newNeuron) )
}

export function selectNeuron(state, key){
	return state.set('selected', key)
}

export function moveSelectedNeuron (state, delta){
	const key = state.get('selected')
	if(!key) return state

	const neurons = state.get('neurons')
	const neuron = neurons.get(key)
	const newNeuron = neuron.set('position', add(neuron.get('position'), delta))

	return state.set('neurons', neurons.set(key, newNeuron))
}

export function deleteSelectedNeuron (state) {
	const key = state.get('selected')
	if(!key) return state

	if(state.get('neurons').has(key)){
		const neurons = state.get('neurons').delete(key)
		const edges = state.get('edges').filter(edge => (edge.get('from') !== key && edge.get('to') !== key))

		return state.merge({ neurons, edges })
	}else{
		return state.set('edges', state.get('edges').delete(key))
	}
}

export function setWeight (state, key, weight) {
	if(typeof weight !== 'number') return state
	const neurons = state.get('neurons')
	return state.set('neurons', neurons.set( key, neurons.get(key).set('weight', weight) ))
}

export function setEdgeWeight(state, key, weight){
	if(typeof weight !== 'number') return state
	const edges = state.get('edges')
	return state.set('edges', edges.set( key, edges.get(key).set('weight', weight) ))
}

export function getSelectedNeuron(state){
	if(!state.get('selected')) return null
	return state.get('neurons').get(state.get('selected'))
}

export function setNeuronLabel (state){
	const selectedNeuron = getSelectedNeuron(state)
	
	const newLabel = prompt("Подпись нейрона", selectedNeuron.get('label') || "")

	if(newLabel === null) return state

	const newNeuron = newLabel === ''? selectedNeuron.delete('label'): selectedNeuron.set('label', newLabel)

	return state.set('neurons', state.get('neurons').set(state.get('selected'), newNeuron) )
}

export function setType (state, type){
	return state.set('type', type)
}
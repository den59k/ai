import React, { useState } from 'react'
import Neuron from 'neuron'
import { createNeuronState } from 'neuron/init'
import { 
	addNeuron, 
	selectNeuron,
	moveSelectedNeuron, 
	deleteSelectedNeuron, 
	genKey, 
	setWeight, 
	setEdgeWeight, 
	setNeuronLabel,
	setType
} from 'neuron/tools'
import { addDraftEdge, moveDraftEdge, removeDraftEdge, confirmDraftEdge } from 'neuron/draft-tools'
import { mouseMove, useKeyDown } from 'neuron/libs'
import { stateToJson, jsonToState } from 'neuron/export'
import { add } from 'mathjs'

import CornerMenu from 'components/corner-menu'
import SegmentButton from 'components/controls/segment-button'

import { useModalList } from 'components/modal-window/modal-list'


const segmentItems = {
	step: "Ступечатая",
	linear: "Линейная"
}

let lastClick = 0

function App() {

	const [ state, setState ] = useState(() => createNeuronState())
	const [ currentWeb, setCurrentWeb ] = useState(null)

	
	useKeyDown({
		'Delete': () => setState(state => deleteSelectedNeuron(state)),
		'F2': () => setState(state => setNeuronLabel(state))
	})

	const onSpaceClick = (pos, e) => {
		if(e.button === 2){
			const key = genKey()
			const newState = selectNeuron(addNeuron(state, pos, key), key)
			setState(newState)
			mouseMove(e, moveNeuron(newState))
			lastClick = Date.now()
		}else{
			setState(selectNeuron(state, null))
		}
	}

	const moveNeuron = (state) => (delta) => {
		lastClick = 0
		setState(moveSelectedNeuron(state, delta))
	}

	const moveEdge = (state, startPos) => (delta) => {
		setState(moveDraftEdge(state, add(startPos, delta)))
	}

	const getFloat = (title) => {
		const value = prompt(title)
		if(!value) return
		const weight = parseFloat(value)
		if(isNaN(weight)) return
		return weight
	}

	const _setWeight = (key) => {
		setState(state => setWeight(state, key, getFloat('Введите новое значение нейрона')))
	}

	const _setEdgeWeight = (key) => {
		const weigth = getFloat('Введите новое значение веса связи')
		setState(state => setEdgeWeight(state, key, weigth))
	}

	const onNeuronClick = (key, e, pos) => {
		const newState = selectNeuron(state, key)
		setState(newState)
		if(e.button === 0){ 

			if(Date.now() - lastClick < 500 && state.get('selected') === key) 
				return _setWeight(key)
				
			lastClick = Date.now()
			mouseMove(e, moveNeuron(newState))
		}
		if(e.button === 2){
			const newState = addDraftEdge(selectNeuron(state, key), key, pos)
			mouseMove(e, moveEdge(newState, pos), () => setState(state => removeDraftEdge(state)))
			setState(newState)
		}
	}

	const onNeuronUp = (key) => setState(state => confirmDraftEdge(state, key))

	const onEdgeClick = (key) => {

		if(Date.now() - lastClick < 500 && state.get('selected') === key) 
			return _setEdgeWeight(key)

		lastClick = Date.now()
		setState(state => selectNeuron(state, key))
	}

	const openModalList = useModalList()

	const menuButtons = [
		{ 
			title: "Загрузить цепь", onClick: () => openModalList((web) => {
				setCurrentWeb({ _id: web._id, name: web.name })
				setState(jsonToState(web.data))
			}) 
		},
		{ title: "Сохранить цепь", onClick: () => openModalList(stateToJson(state), currentWeb && currentWeb._id) },
		{ title: "Сохранить цепь как...", onClick: () => openModalList(stateToJson(state), null) },
		
	]

	const changeType = key => setState(state => setType(state, key))

	return (
		<>
			<header className="header">
				<CornerMenu buttons={menuButtons}/>
				<div className="title">{currentWeb && currentWeb.name}</div>
				<SegmentButton options={segmentItems} onChange={changeType} value={state.get('type')} style={{marginLeft: 'auto'}}/>
			</header>
			
			<Neuron state={state} onSpaceClick={onSpaceClick} onNeuronClick={onNeuronClick} onEdgeClick={onEdgeClick} onNeuronUp={onNeuronUp}/>
		</>
	);
}

export default App;

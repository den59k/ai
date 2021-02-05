import { Map } from 'immutable'

export function addDraftEdge (state, neuronKey, pos){
	
	return state.set('draftEdge', new Map({
		from: neuronKey,
		to: pos
	}))
}

export function moveDraftEdge (state, pos){
	return state.set('draftEdge', state.get('draftEdge').set('to', pos))
}

export function removeDraftEdge (state) {
	return state.set('draftEdge', null)
}

export function confirmDraftEdge (state, key2){
	if(!state.get('draftEdge')) return state
	const key1 = state.get('draftEdge').get('from')
	if(key1 === key2) return state.set('draftEdge', null)
	return state.set('edges', state.get('edges').set( key1.toString() + '-'+key2.toString(), new Map({from: key1, to: key2, weight: 1}) ))
}
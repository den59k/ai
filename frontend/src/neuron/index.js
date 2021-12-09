import { useMemo, useRef, useEffect, useState } from 'react'
import cn from 'classnames'
import { cancel } from './libs'
import computeValues from './compute'

import styles from './styles.module.sass'
import { add, hypot, multiply, subtract } from 'mathjs'

export default function NeuronWeb ({values, state, onSpaceClick, onNeuronClick, onEdgeClick, onNeuronUp}){

	const svgRef = useRef()
	const [ size, setSize ] = useState([1920, 1080])
	const neurons = state.get('neurons')
	const edges = state.get('edges')
	const type = state.get('type')

	useEffect(() => {
		const resize = () => setSize([ window.innerWidth, window.innerHeight ])
		resize()

		window.addEventListener("resize", resize)

		return () => window.removeEventListener("resize", resize)
	}, [])

	//const values = useMemo (() => computeValues(neurons, edges, type), [ neurons, edges, type ])

	const getNeuronPosition = (key) => {
		return neurons.get(key).get('position')
	}

	const onClick = (e) => {
		if(e.target === svgRef.current){
			const rect = svgRef.current.getBoundingClientRect()
			return onSpaceClick([ e.clientX-rect.x, e.clientY-rect.y ], e)
		} 
	}

	const getNeuron = (neuron, key) => {

		const active = state.get('selected') === key

		const onClick = (e) => {
			const rect = svgRef.current.getBoundingClientRect()
			return onNeuronClick(key, e, [ e.clientX-rect.x, e.clientY-rect.y ])
		}

		const onMouseUp = (e) => {
			onNeuronUp(key)
		}

		let starting = true
		let ending = true
		
		state.get('edges').forEach(edge => {
			if(edge.get('from') === key) ending = false
			if(edge.get('to') === key) starting = false
		})

		return <Neuron starting={starting} ending={ending} key={key} weight={values.get(key)} neuron={neuron} onMouseUp={onMouseUp} onMouseDown={onClick} active={active}/>
	}

	const getEdge = (edge, key) => {

		const coord = { from: getNeuronPosition(edge.get('from')), to: getNeuronPosition(edge.get('to'))	}
		const active = state.get('selected') === key

		const onClick = (e) => {
			const rect = svgRef.current.getBoundingClientRect()
			return onEdgeClick(key, e, [ e.clientX-rect.x, e.clientY-rect.y ])
		}

		if(edge.get('from') === edge.get('to'))
			return <CircleLine key={key} from={coord.from} weight={edge.get('weight')} active={active} onMouseDown={onClick}/>

		return <Line key={key} {...coord} weight={edge.get('weight')} active={active} onMouseDown={onClick}/>
	}

	return (
		<svg ref={svgRef} width={size[0]} height={size[1]} onMouseDown={onClick} className={styles.container} onContextMenu={cancel}>
			{state.get('draftEdge') && <Line from={getNeuronPosition( state.get('draftEdge').get('from') )} to={state.get('draftEdge').get('to')}/>}
			{edges.map(getEdge).valueSeq().toArray()}
			{neurons.map(getNeuron).valueSeq().toArray()}
		</svg>
	)
}

function Line ({from, to, onMouseDown, active, weight}){

	const vector = subtract(to, from)
	const h = hypot(vector)
	const vec = [vector[1] / h * 1.5 * 15, -vector[0] / h * 15]
	const coord = add(from, multiply(vector, 0.65), vec)

	const coord2 = subtract(to, multiply(vector, 37/h))			//Для отрицательной связи добавим круг в конце линии

	return (
		<>
			<line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} onMouseDown={onMouseDown} className={cn(styles.edge, active && styles.active)}/>
			{ typeof weight === 'number' && <text x={coord[0]} y={coord[1]} className={styles.text}>{Math.floor(weight*100)/100}</text>}
			{ typeof weight === 'number' && weight < 0 && <circle r={5} cx={coord2[0]} cy={coord2[1]} className={styles.negative}/>}
		</>
	)
}

function CircleLine ({ from, active, weight, onMouseDown }){
	const radius = 30

	return (
		<>
			<circle cx={from[0]+25} cy={from[1]-25} r={radius} className={cn(styles.edge, active && styles.active)} onMouseDown={onMouseDown}/>
			{ typeof weight === 'number' && (
				<text x={from[0]+ 30 + radius} y={from[1] - 25 - radius} className={styles.text}>{Math.floor(weight*100)/100}</text>
			)}
		</>
	)
}

function Neuron ({weight,neuron, active, onMouseDown, onMouseUp, starting, ending}){
	const coord = { cx: neuron.get('position')[0], cy: neuron.get('position')[1] }

	const coordText = { x: coord.cx, y: coord.cy }
	const text = Math.floor(neuron.get('weight')*100)/100

	const activated = weight > neuron.get('weight')
	
	return (
		<>
			<circle {...coord} r={30} onMouseUp={onMouseUp} onMouseDown={onMouseDown} className={cn(styles.neuron, activated && styles.activated, active && styles.active)}/>
			<text {...coordText} className={styles.text}>{text}</text>
			{ typeof(weight) === 'number' && ( <text {...coordText} className={styles.weight}>{Math.floor(weight*100)/100}</text> )}
			{ neuron.has('label') && <text className={cn(styles.label, starting && styles.starting, ending && styles.ending)} {...coordText}>
				{ neuron.get('label') }
			</text> }
		</>
	)
}
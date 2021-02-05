import { useState } from 'react'
import { useModal } from './index'
import { GET, REST } from 'libs/fetch'
import useSWR from 'swr'
import { num, getTime } from 'libs/rus'

import styles from './modal-list.module.sass'
import controlStyles from 'components/controls/controls.module.sass'

import ModalBase from './modal-base'
import Input from 'components/controls/input'

export default function ModalList ({ data, onLoad }){

	const [ values, setValues ] = useState({})
	const { data: webList } = useSWR('/api', GET)
	const { close } = useModal()

	const onChange = (obj) => {
		setValues(values => ({ ...values, ...obj }) )
	}

	const save = async () => {
		if(!values.name || values.name.length < 3) return
		const resp = await REST('/api', { name: values.name, data })
		close()
	}

	if(data)
		return (
			<ModalBase title={"Сохранить сеть"}>
				<Input placeholder="Название проекта..." name="name" onChange={onChange} value={values.name}/>
				<button className={controlStyles.button} style={{marginTop: "1em", alignSelf: "center"}} onClick={save}>
					Сохранить
				</button>
			</ModalBase>
		)

	const onItemClick = async (id) => {
		const web = await GET('/api/'+id)
		onLoad(web)
		close()
	}

	return (
		<ModalBase title={"Загрузить сеть"}>
			<WebList list={webList} onClick={onItemClick}/>
		</ModalBase>
	)
}

function WebList ({list, onClick}){
	if(!list) return null

	return (
		<div className={styles.list}>
			{list.map(item => (
				<button key={item._id} onClick={() => onClick(item._id)}>
					<div className={styles.title}>{item.name}</div>
					<div className={styles.sub}>
						<div>{num(item.countNeurons, 'нейрон', 'нейрона', 'нейронов')} / {num(item.countEdges, 'связь', 'связи', 'связей')}</div>
						<div>{getTime(item.timestep)}</div>
					</div>
				</button>
			))}
		</div>
	)
}

export function useModalList () {
	const { open } = useModal()
	
	const _open = (data, _id) => {

		if(typeof(data) === 'object'){
			if(Object.keys(data.neurons).length === 0) return
			if(_id !== null && _id !== undefined) return REST( '/api/'+_id, { data }, 'PUT' ).then(() => console.log('saved'))

			open( <ModalList data={data}/> )
		}else{
			open( <ModalList onLoad={data}/> )
		}
	}

	return _open
}
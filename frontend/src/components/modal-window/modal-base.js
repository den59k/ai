import { useKeyDown } from 'neuron/libs'
import { useModal } from './index'
import styles from './modal-window.module.sass'

import { IoIosClose } from 'react-icons/io'

export default function ModalBase ({ children, title }){

	const { close } = useModal()

	useKeyDown({
		'Escape': close
	})

	return (
		<div className={styles.modal}>
			<div className={styles.header}>
				<h3>{ title }</h3>
				<button className={styles.closeButton} onClick={close}> <IoIosClose/> </button>
			</div>
			<div className={styles.content}>
				{children}
			</div>
		</div>
	)
}
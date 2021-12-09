import { IoIosPlay } from 'react-icons/io'

import styles from './controls.module.sass'

export default function PlayButton ({onClick}){
	return (
		<button onClick={onClick} className={styles.playButton}><IoIosPlay/></button>
	)
}
import cn from 'classnames'
import styles from './controls.module.sass'

export default function Input ({ placeholder, name, onChange, value }){

	const _onChange = (e) => {
		onChange({ [name]: e.currentTarget.value })
	}

	return (
		<div className={styles.input}>
			<input name={name} onChange={_onChange} value={value || ""} placeholder={placeholder} />
		</div>
	)
}
import cn from 'classnames'

import styles from './controls.module.sass'

export default function SegmentButton ({options, value, onChange, style}){

	return (
		<div className={styles.segmentButton} style={style}>
			{ Object.keys(options).map(key => (
				<button key={key} onClick={() => onChange(key)} className={cn(value === key && styles.active)}>
					{options[key]}
				</button>
			))}
		</div>
	)
}
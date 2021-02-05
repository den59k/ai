import { createContext, useContext, useState } from 'react'
import cn from 'classnames'

import styles from './modal-window.module.sass'

const Context = createContext()

export function ModalWrapper ({children, className, style}){

	const [ modalWindow, setModalWindow ] = useState(null);
	const [ scroll, setScroll ] = useState(null);

	const open = (_modal) => {
		setScroll({left: window.pageXOffset, top: window.pageYOffset, offset: window.innerWidth-document.body.clientWidth});
		setModalWindow(_modal);
		window.requestAnimationFrame(() => window.scroll(0, 0));
	}

	const close = () => {
		setModalWindow(null);
		window.requestAnimationFrame(() => window.scroll(scroll.left, scroll.top));
	}

	const onClick = (e) => {					
		const target = e.currentTarget;
		if(target === e.target){
			document.addEventListener("mouseup", (e2) => {		//Ну а вот это неплохой код для модалки
				if(target === e2.target) close()
			}, { once: true });
		}		
	}

	return (
		<Context.Provider value={{ open, close }}>
			<div 
				className={cn( className, modalWindow !== null && styles.fixed )} 
				style={scroll?{...style, top: -scroll.top+'px', left: -scroll.left+'px', right: scroll.offset+'px'}: style}
			>
				{children}
			</div>
			
			{ modalWindow !== null && (
				<div className={styles.black} onMouseDown={onClick}>
					{modalWindow}
				</div>
			) }
		</Context.Provider>
	)
}


export function useModal () {
	const context = useContext(Context)
	return context
}

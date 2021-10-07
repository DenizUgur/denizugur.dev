import React, { useLayoutEffect, useRef } from 'react';
import styles from './App.module.scss';
import Animate from './lib/meteorshower';
import { Home } from './sections';
// import { useMediaPredicate } from 'react-media-hook';

const data = require('./data/meta.json');

function App() {
	const animate = useRef<null | Animate>(null);
	const bg = useRef(null);
	// const preferredTheme = useMediaPredicate('(prefers-color-scheme: dark)')
	// 	? 'dark'
	// 	: 'light';
	const preferredTheme = 'dark';

	useLayoutEffect(() => {
		if (animate.current) {
			Animate.changeColors(
				data.background[preferredTheme].sky_color,
				data.background[preferredTheme].star_color
			);
		} else {
			animate.current = new Animate(
				bg.current,
				data.background[preferredTheme].sky_color,
				data.background[preferredTheme].star_color
			);
			Animate.animate();
		}
		return () => {};
	}, [preferredTheme]);

	useLayoutEffect(() => {
		const update = (init: boolean) => {
			if (!init) Animate.resetCanvas();

			const doc = document.documentElement;
			doc.style.setProperty('--app-height', `${window.innerHeight}px`);
		};
		window.addEventListener('resize', () => update(false));
		window.addEventListener('orientationchange', () => update(false));
		update(true);
		return () => {
			window.removeEventListener('resize', () => {});
			window.removeEventListener('orientationchange', () => {});
		};
	}, []);

	return (
		<>
			<div className={styles.stage}>
				<Home />
			</div>
			<canvas ref={bg}></canvas>
		</>
	);
}

export default App;

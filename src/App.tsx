import React, { useLayoutEffect, useRef } from 'react';
import Animate from './lib/meteorshower';
import styles from './App.module.scss';
import { CV } from './sections';

const data = require('./data/meta.json');

function App() {
	const bg = useRef(null);

	useLayoutEffect(() => {
		new Animate(
			bg.current,
			data.background.sky_color,
			data.background.star_color
		);
		Animate.animate();
		const update = (init: boolean) => {
			if (!init) Animate.resetCanvas();

			const doc = document.documentElement;
			doc.style.setProperty('--app-height', `${window.innerHeight}px`);
		};
		window.addEventListener('resize', () => update(false));
		update(true);
		return () => {};
	}, []);

	return (
		<>
			<main>
				<section className={styles.intro} id="home">
					<div className={styles.main}>
						<div className={styles.intro_content}>
							<div className={styles.name}>Deniz Uğur</div>
							<table className={styles.title}>
								{data.title.map((el: any) => (
									<tr>
										<td>
											<i className={`fas ${el.icon}`} />
										</td>
										<td>{el.text}</td>
									</tr>
								))}
							</table>
							<p>{data.bio}</p>
						</div>
					</div>
					<a className={styles.more} href="#cv">
						Learn More
					</a>
				</section>
				<section className={styles.full} id="cv">
					<CV />
				</section>
				<footer>Copyright &#169; 2021, Deniz Ugur</footer>
			</main>
			<canvas ref={bg}></canvas>
		</>
	);
}

export default App;

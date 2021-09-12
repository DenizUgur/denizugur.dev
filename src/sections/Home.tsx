import React, { useState } from 'react';
import styles from '../App.module.scss';
import { CV } from '.';

const data = require('../data/meta.json');

export default function Home() {
	const [contactDrawer, setContactDrawer] = useState(false);
	return (
		<main>
			<section className={styles.intro} id="home">
				<div className={[styles.main, styles.with_pp].join(' ')}>
					<div className={styles.intro_content}>
						<div className={styles.header}>
							<span>Deniz Uğur</span>
							<div className={styles.icons}>
								<div>
									{data.contact.map(
										(el: any) =>
											el.priority && (
												<a
													href={el.link}
													key={el.link}
													target="_blank"
													rel="noopener noreferrer">
													<i className={el.icon}></i>
												</a>
											)
									)}
								</div>
								<a
									href="#contact"
									onClick={() => setContactDrawer(!contactDrawer)}>
									<i className="fas fa-ellipsis-h"></i>
								</a>
							</div>
						</div>
						<table className={styles.title}>
							<tbody>
								{data.title.map((el: any) => (
									<tr key={el.text}>
										<td>
											<i className={el.icon} />
										</td>
										<td>{el.text}</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className={styles.contact_details} hidden={!contactDrawer}>
							<h3>Contact me&#8230;</h3>
							<table>
								<tbody>
									{data.contact.map((el: any) => (
										<tr key={el.text}>
											<td>
												<i className={el.icon} />
											</td>
											<td>
												<a
													href={el.link}
													target="_blank"
													rel="noopener noreferrer">
													{el.text}
												</a>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<p>{data.bio}</p>
					</div>
				</div>
				<div className={styles.nav_buttons}>
					<div onClick={() => document.getElementById('cv')?.scrollIntoView()}>
						Learn More
					</div>
				</div>
			</section>
			<section className={styles.full} id="cv">
				<CV />
			</section>
			<footer>Copyright &#169; 2021, Deniz Ugur</footer>
		</main>
	);
}

import React from 'react';
import styles from './CV.module.scss';
import ReactMarkdown from 'react-markdown';
const data = require('../data/cv.json');

export default function CV() {
	return (
		<div className={styles.container}>
			{Object.keys(data).map((key, _) => (
				<div key={key}>
					<div className={styles.heading}>{key}</div>
					{data[key].map((el: any) => (
						<div className={styles.item} key={Math.random()}>
							<div className={styles.logo}>
								{el.img && (
									<img
										src={require(`../img/${el.img.file}`).default}
										alt={el.img.alt}
									/>
								)}
							</div>

							<div className={styles.content}>
								<div>
									<a
										href={el.header.link}
										target="_blank"
										rel="noopener noreferrer">
										{el.header.name}
									</a>
									<span>
										{el.from} {el.to && `- ${el.to}`}
									</span>
								</div>
								<span className={styles.sub}>{el.title}</span>
								{el.content && (
									<div className={styles.sub_content}>
										<ReactMarkdown>{el.content}</ReactMarkdown>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			))}
		</div>
	);
}

import React from 'react';
import styles from './CV.module.scss';
import ReactMarkdown from 'react-markdown';

const data = require('../data/cv.json');

const Default = (props: any) => {
	const { el } = props;
	return (
		<div className={styles.content}>
			<div>
				<a href={el.header.link} target="_blank" rel="noopener noreferrer">
					{el.header.name}
				</a>
				<span className={styles.year}>
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
	);
};

const Publication = (props: any) => {
	const { el } = props;
	return (
		<div className={styles.content}>
			<div>
				<a
					href={el.header.link}
					target="_blank"
					rel="noopener noreferrer"
					className={el.header.link ? styles.has_link : ''}>
					{el.header.title}
				</a>
				<span className={styles.year}>{el.date}</span>
			</div>
			<span className={styles.sub}>
				{el.position}
				{` — `}
				<b>
					<a
						href={el.published_on.link}
						target="_blank"
						rel="noopener noreferrer">
						{el.published_on.name}
					</a>
				</b>
			</span>
			{el.doi && <span className={styles.sub}>DOI: {el.doi}</span>}
			{el.content && (
				<div className={styles.sub_content}>
					<ReactMarkdown>{el.content}</ReactMarkdown>
				</div>
			)}
		</div>
	);
};

export default function CV() {
	const getComponent = (key: string, el: any) => {
		switch (key) {
			case 'publications':
				return <Publication el={el} />;
			default:
				return <Default el={el} />;
		}
	};

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
							{getComponent(key, el)}
						</div>
					))}
				</div>
			))}
		</div>
	);
}

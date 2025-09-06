// src/components/ServiceDomainCanvas.tsx
import { layout, domainData } from "../data/domainData";
import DomainSection from "./DomainSection";
import styles from "./ServiceDomainCanvas.module.css";

const ServiceDomainCanvas = () => {
	const allDomains = Object.values(domainData).flat();

	console.log({ allDomains });

	return (
		<div className={styles.canvas}>
			{/* {layout.columns.map((column, colIndex) => (
				<div key={colIndex} className={styles.column}>
					{column.domainNames.map((domainName) => {
						const domain = allDomains.find((d) => d.name === domainName);
						return domain ? (
							<DomainSection key={domain.name} domain={domain} />
						) : null;
					})}
				</div>
			))} */}

			{allDomains.map((area) => (
				<DomainSection key={area.name} domain={area} />
			))}
		</div>
	);
};

export default ServiceDomainCanvas;

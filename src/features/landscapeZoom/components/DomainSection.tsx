// src/components/DomainSection.tsx
import { Domain } from "../data/domainData";
import SubDomainGroup from "./SubDomainGroup";
import styles from "./DomainSection.module.css";

interface DomainSectionProps {
	domain: Domain;
}

const DomainSection = ({ domain }: DomainSectionProps) => {
	return (
		<div className={styles.section}>
			<h2 className={styles.title}>{domain.name}</h2>
			<div className={styles.content}>
				{domain.subDomains.map((subDomain) => (
					<SubDomainGroup key={subDomain.name} subDomain={subDomain} />
				))}
			</div>
		</div>
	);
};

export default DomainSection;

// src/components/SubDomainGroup.tsx
import { SubDomain } from "../data/domainData";
import ServiceItem from "./ServiceItem";
import styles from "./SubDomainGroup.module.css";

interface SubDomainGroupProps {
	subDomain: SubDomain;
}

const SubDomainGroup = ({ subDomain }: SubDomainGroupProps) => {
	return (
		<div className={styles.group}>
			<h3 className={styles.title}>{subDomain.name}</h3>
			<div className={styles.grid}>
				{subDomain.services.map((service) => (
					<ServiceItem key={service.name} name={service.name} />
				))}
			</div>
		</div>
	);
};

export default SubDomainGroup;

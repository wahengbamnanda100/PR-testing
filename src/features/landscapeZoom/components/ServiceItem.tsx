// src/components/ServiceItem.tsx
import styles from "./ServiceItem.module.css";

interface ServiceItemProps {
	name: string;
}

const ServiceItem = ({ name }: ServiceItemProps) => {
	return (
		<div className={styles.item}>
			{/* <span className={styles.label}>«ServiceDomain»</span> */}
			<span className={styles.name}>{name}</span>
		</div>
	);
};

export default ServiceItem;

import React from "react";
import { Box } from "./SharedComponents";
import LayoutItem from "./LayoutItem";

interface DynamicLayoutContainerProps {
	layout?: any;
	content?: any;
	scale?: number;
	onServiceClick?: (service: any, serviceIndex: number) => void;
}

const DynamicLayoutContainer: React.FC<DynamicLayoutContainerProps> = ({
	layout,
	content,
	scale = 1,
	onServiceClick,
}) => {
	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				backgroundColor: "#000",
				borderRadius: "8px",
				display: "flex",
				overflow: "hidden",
				boxSizing: "border-box",
				padding: "4px",
			}}>
			<LayoutItem config={layout} contentData={content} scale={scale} onServiceClick={onServiceClick} />
		</Box>
	);
};

export default DynamicLayoutContainer;
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { bianData, mapBianToContentData } from "../data/configData";
import { Box, DynamicLayoutContainer } from "./canvas/index";

const layoutConfig = {
	type: "container",
	direction: "row",
	spacing: 1.5,
	children: [
		// Main Left Section
		{
			type: "container",
			direction: "column",
			spacing: 1.5,
			flex: 5,
			children: [
				{
					type: "row",
					direction: "row",
					spacing: 1.5,
					flex: 0.5,
					children: [
						{
							type: "item",
							id: "item8",
							flex: 2,
						},
						{
							type: "item",
							id: "item7",
							flex: 2,
						},
					],
				},
				{
					type: "row",
					direction: "row",
					spacing: 1.5,
					flex: 1.3,
					children: [
						{
							type: "item",
							id: "item1",
							flex: 1.2,
						},
						{
							type: "item",
							id: "item3",
							flex: 1.2,
						},
						{
							type: "item",
							id: "item4",
							flex: 3,
						},
						{
							type: "item",
							id: "item6",
							flex: 1.2,
						},
					],
				},
				{
					type: "row",
					direction: "row",
					spacing: 1,
					flex: 0.6,
					children: [
						{
							type: "item",
							id: "item2",
							flex: 2,
							highlight: true,
						},
					],
				},
			],
		},
		// Main Right Section
		{
			type: "item",
			id: "item5",
			flex: 1,
		},
	],
};

// Map user-provided BIAN hierarchy into the Lego content structure
const contentData = mapBianToContentData(bianData);



// Demo component showing different layout configurations
interface LayoutDemoProps {
	scale?: number;
	onServiceClick?: (service: any, serviceIndex: number) => void;
}

const LayoutDemo: React.FC<LayoutDemoProps> = ({ scale = 1, onServiceClick }) => {
	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				margin: "0",
				overflow: "hidden",
				boxSizing: "border-box",
			}}>
			<DynamicLayoutContainer
				layout={layoutConfig}
				content={contentData}
				scale={scale}
				onServiceClick={onServiceClick}
			/>
		</Box>
	);
};

export default LayoutDemo;

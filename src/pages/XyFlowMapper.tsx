// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";
// import { Box } from "@mui/material";

// interface BoxData {
// 	id: string;
// 	label: string;
// 	x: number;
// 	y: number;
// 	width: number;
// 	height: number;
// 	parent?: string;
// }

// const nodes: BoxData[] = [
// 	{ id: "1", label: "Parent", x: 250, y: 250, width: 150, height: 100 },
// 	{
// 		id: "1-1",
// 		label: "Child 1",
// 		x: 150,
// 		y: 150,
// 		width: 100,
// 		height: 60,
// 		parent: "1",
// 	},
// 	{
// 		id: "1-2",
// 		label: "Child 2",
// 		x: 350,
// 		y: 150,
// 		width: 100,
// 		height: 60,
// 		parent: "1",
// 	},
// 	{
// 		id: "1-1-1",
// 		label: "Nested 1-1",
// 		x: 130,
// 		y: 130,
// 		width: 80,
// 		height: 50,
// 		parent: "1-1",
// 	},
// 	{
// 		id: "1-1-2",
// 		label: "Nested 1-2",
// 		x: 190,
// 		y: 130,
// 		width: 80,
// 		height: 50,
// 		parent: "1-1",
// 	},
// 	{
// 		id: "1-2-1",
// 		label: "Nested 2-1",
// 		x: 330,
// 		y: 130,
// 		width: 80,
// 		height: 50,
// 		parent: "1-2",
// 	},
// ];

// const BoxMap: React.FC = () => {
// 	const containerRef = useRef<HTMLDivElement>(null);

// 	useEffect(() => {
// 		if (!containerRef.current) return;

// 		const { width, height } = containerRef.current.getBoundingClientRect();

// 		const zoom = d3
// 			.zoom<SVGSVGElement, unknown>()
// 			.scaleExtent([1, 8])
// 			.on("zoom", zoomed);

// 		const svg = d3
// 			.select(containerRef.current)
// 			.append("svg")
// 			.attr("width", "100%")
// 			.attr("height", "100%")
// 			.attr("viewBox", `0 0 ${width} ${height}`)
// 			.attr("preserveAspectRatio", "xMidYMid meet")
// 			.style("display", "block")
// 			.style("background", "#f8f8f8") // Optional: Background color
// 			.call(zoom);

// 		const container = svg.append("g");

// 		function updateBoxes(currentZoom: number) {
// 			let filteredNodes: BoxData[] = nodes;
// 			if (currentZoom < 1.5) filteredNodes = nodes.filter((d) => d.id === "1");
// 			else if (currentZoom < 2.5)
// 				filteredNodes = nodes.filter((d) => d.id === "1" || d.parent === "1");

// 			const boxGroups = container
// 				.selectAll<SVGGElement, BoxData>("g.box")
// 				.data(filteredNodes, (d) => d.id);

// 			boxGroups.exit().remove();

// 			const enterGroups = boxGroups
// 				.enter()
// 				.append("g")
// 				.attr("class", "box")
// 				.on("click", clicked);

// 			enterGroups
// 				.append("rect")
// 				.attr("fill", "steelblue")
// 				.attr("stroke", "white");
// 			enterGroups
// 				.append("text")
// 				.attr("text-anchor", "middle")
// 				.attr("fill", "#fff")
// 				.attr("font-size", "12px");

// 			const merged = enterGroups.merge(boxGroups);
// 			merged.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
// 			merged
// 				.select("rect")
// 				.attr("width", (d) => d.width)
// 				.attr("height", (d) => d.height);
// 			merged
// 				.select("text")
// 				.attr("x", (d) => d.width / 2)
// 				.attr("y", (d) => d.height / 2 + 4)
// 				.text((d) => d.label);
// 		}

// 		function clicked(event: any, d: BoxData) {
// 			event.stopPropagation();
// 			const hasChildren = nodes.some((n) => n.parent === d.id);
// 			if (!hasChildren) return;

// 			const targetZoom = 3;
// 			const translateX = width / 2 - targetZoom * (d.x + d.width / 2);
// 			const translateY = height / 2 - targetZoom * (d.y + d.height / 2);
// 			const t = d3.zoomIdentity
// 				.translate(translateX, translateY)
// 				.scale(targetZoom);

// 			svg.transition().duration(750).call(zoom.transform, t);
// 		}

// 		function zoomed(event: any) {
// 			container.attr("transform", event.transform);
// 			updateBoxes(event.transform.k);
// 		}

// 		updateBoxes(1);

// 		return () => {
// 			d3.select(containerRef.current).select("svg").remove();
// 		};
// 	}, []);

// 	return (
// 		<Box
// 			ref={containerRef}
// 			sx={{
// 				width: "100vw",
// 				height: "100vh",
// 				position: "relative",
// 				overflow: "hidden",
// 				bgcolor: "background.paper", // Uses MUI theme
// 				borderRadius: 2, // Optional rounded edges
// 				boxShadow: 2, // MUI shadow effect
// 			}}
// 		/>
// 	);
// };

// export default BoxMap;

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

interface BoxData {
	id: string;
	label: string;
	width: number;
	height: number;
	children?: BoxData[];
}

const data: BoxData = {
	id: "1",
	label: "Parent",
	width: 300,
	height: 200,
	children: [
		{
			id: "1-1",
			label: "Child 1",
			width: 250,
			height: 150,
			children: [
				{ id: "1-1-1", label: "Nested 1-1", width: 200, height: 100 },
				{ id: "1-1-2", label: "Nested 1-2", width: 200, height: 100 },
			],
		},
		{
			id: "1-2",
			label: "Child 2",
			width: 250,
			height: 150,
			children: [{ id: "1-2-1", label: "Nested 2-1", width: 200, height: 100 }],
		},
	],
};

const NestedBox: React.FC<{
	node: BoxData;
	currentLevel: number;
	zoomLevel: number;
}> = ({ node, currentLevel, zoomLevel }) => {
	const showChildren = zoomLevel > currentLevel + 1; // Show children only when zoom level reaches their depth

	return (
		<Box
			sx={{
				width: node.width * (zoomLevel / (currentLevel + 1)),
				height: node.height * (zoomLevel / (currentLevel + 1)),
				bgcolor: "steelblue",
				color: "white",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				border: "2px solid white",
				position: "relative",
				padding: 2,
				borderRadius: 2,
				transition: "all 0.3s ease-in-out",
			}}>
			<Typography variant="body1">{node.label}</Typography>

			{showChildren && node.children && (
				<Box
					sx={{
						display: "flex",
						gap: 2,
						mt: 2,
						width: "100%",
						justifyContent: "center",
						flexWrap: "wrap",
					}}>
					{node.children.map((child) => (
						<NestedBox
							key={child.id}
							node={child}
							currentLevel={currentLevel + 1}
							zoomLevel={zoomLevel}
						/>
					))}
				</Box>
			)}
		</Box>
	);
};

const ZoomableContainer: React.FC = () => {
	const [zoomLevel, setZoomLevel] = useState(1);

	return (
		<TransformWrapper
			initialScale={1}
			minScale={1}
			maxScale={5}
			onZoomStop={(e) => setZoomLevel(e.state.scale)}>
			<TransformComponent>
				<Box
					sx={{
						width: "100vw",
						height: "100vh",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						bgcolor: "background.default",
					}}>
					<NestedBox node={data} currentLevel={0} zoomLevel={zoomLevel} />
				</Box>
			</TransformComponent>
		</TransformWrapper>
	);
};

export default ZoomableContainer;

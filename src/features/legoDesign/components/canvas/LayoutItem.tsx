/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import { Box, Typography } from "./SharedComponents";
import ServiceDomainItem from "./ServiceDomainItem";

interface LayoutItemProps {
	config: any;
	contentData: any;
	scale: number;
	onServiceClick?: (service: any, serviceIndex: number) => void;
}

const LayoutItem: React.FC<LayoutItemProps> = ({ config, contentData, scale, onServiceClick }) => {
	if (config.type === "item") {
		const itemData = contentData[config.id] || {};
		const isHighlighted = config.highlight;
		const containerRef = useRef<HTMLDivElement>(null);
		// Use scale from parent instead of container size
		const isZoomedIn = scale > 2;

		return (
			<Box
				ref={containerRef}
				sx={{
					flex: config.flex || 1,
					border: isHighlighted ? "3px solid #2196f3" : "2px solid #666",
					borderRadius: "8px",
					padding: isZoomedIn ? "6px" : "8px",
					backgroundColor: itemData.backgroundColor || "#f9f9f9",
					display: "flex",
					flexDirection: "column",
					gap: isZoomedIn ? "4px" : "6px",
					overflow: "hidden",
					minWidth: "120px",
					minHeight: "120px",
					maxWidth: "100%",
					maxHeight: "100%",
					boxSizing: "border-box",
				}}>
				{!isZoomedIn && (
					<Typography
						variant="h6"
						color="primary"
						sx={{
							flexShrink: 0,
							textAlign: "center",
							whiteSpace: "pre-wrap",
							wordBreak: "break-word",
							maxWidth: "100%",
							fontSize: "0.7rem",
							fontWeight: 500,
							marginBottom: "2px",
							lineHeight: 1.1,
						}}>
						{itemData.label || config.id}
					</Typography>
				)}

				{itemData.children && Array.isArray(itemData.children) && (
					<Box
						sx={{
							flexGrow: 1,
							minHeight: 0,
							minWidth: 0,
							maxWidth: "100%",
							maxHeight: "100%",
							overflow: "hidden",
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
							gap: "6px",
							alignContent: "start",
						}}>
						{itemData.children.map((child: any, childIndex: number) => {
							const subitemColors = [
								"#e3f2fd",
								"#f3e5f5",
								"#e8f5e8",
								"#fff3e0",
								"#fce4ec",
								"#f0f4c3",
							];
							const gridColors = [
								["#bbdefb", "#90caf9", "#64b5f6"],
								["#ce93d8", "#ba68c8", "#ab47bc"],
								["#a5d6a7", "#81c784", "#66bb6a"],
								["#ffcc02", "#ffb300", "#ff8f00"],
								["#f8bbd9", "#f48fb1", "#f06292"],
								["#dce775", "#d4e157", "#cddc39"],
							];

							const tileMinWidthPx = 80;
							const tileRowHeightPx = 44; // Height for exactly 2 lines of text

							return (
								<Box
									key={childIndex}
									sx={{
										flex: "0 0 auto",
										minHeight: "auto",
										height: "auto",
										padding: "4px",
										borderRadius: "8px",
										backgroundColor:
											subitemColors[childIndex % subitemColors.length],
										border: "1px solid #ddd",
										overflow: "hidden",
										display: "flex",
										flexDirection: "column",
										gap: "4px",
										boxSizing: "border-box",
									}}>
									<Typography
										variant="caption"
										color="primary"
										sx={{
											flexShrink: 0,
											textAlign: "center",
											fontWeight: 500,
											fontSize: "0.56rem",
											lineHeight: 1.2,
											whiteSpace: "pre-wrap",
											wordBreak: "break-word", 
										}}>
										{child.subItem}
									</Typography>
									<Box
										sx={{
											flexGrow: 0,
											display: "grid",
											gridTemplateColumns: `repeat(auto-fit, minmax(${tileMinWidthPx}px, 1fr))`,
											gridAutoRows: `${tileRowHeightPx}px`,
											gap: "4px",
											padding: "4px",
											borderRadius: "4px",
											backgroundColor:
												gridColors[childIndex % gridColors.length],
											border: "1px solid #ccc",
											minHeight: `${tileRowHeightPx}px`,
											boxSizing: "border-box",
											overflow: "visible",
										}}>
										{child.grids.map((grid: any, gridIndex: number) => (
											<ServiceDomainItem
												key={grid.id || gridIndex}
												grid={grid}
												gridIndex={gridIndex}
												childIndex={childIndex}
												gridColors={gridColors}
												onServiceClick={onServiceClick}
											/>
										))}
									</Box>
								</Box>
							);
						})}
					</Box>
				)}
			</Box>
		);
	}

	if (config.type === "row" || config.type === "container") {
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: config.direction === "column" ? "column" : "row",
					gap: `${(config.spacing || 1) * 8}px`,
					flex: config.flex || 1,
					minWidth: 0,
					minHeight: 0,
					maxWidth: "100%",
					maxHeight: "100%",
					overflow: "hidden",
					borderRadius: "4px",
					transition: "all 0.2s ease",
					"&:hover": {
						backgroundColor: "rgba(0, 0, 0, 0.01)",
						boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
					},
				}}>
				{config.children?.map((child: any, index: number) => (
					<LayoutItem
						key={child.id || index}
						config={child}
						contentData={contentData}
						scale={scale}
						onServiceClick={onServiceClick}
					/>
				))}
			</Box>
		);
	}

	return null;
};

export default LayoutItem;
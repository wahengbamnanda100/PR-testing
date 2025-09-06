import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Box, Typography } from "./SharedComponents";
import ServiceDomainDrawer from "./ServiceDomainDrawer";

interface ServiceDomainItemProps {
	grid: any;
	gridIndex: number;
	childIndex: number;
	gridColors: string[][];
	onServiceClick?: (service: any, serviceIndex: number) => void;
}

const ServiceDomainItem: React.FC<ServiceDomainItemProps> = ({
	grid,
	gridIndex,
	childIndex,
	gridColors,
	onServiceClick,
}) => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const handleItemClick = () => {
		if (onServiceClick) {
			// Use shared drawer if callback is provided
			onServiceClick(grid, gridIndex);
		} else {
			// Fall back to local drawer for backward compatibility
			setIsDrawerOpen(true);
		}
	};

	const handleCloseDrawer = () => {
		setIsDrawerOpen(false);
	};

	return (
		<>
			<Box
				onClick={handleItemClick}
				sx={{
					backgroundColor:
						gridColors[childIndex % gridColors.length][
							gridIndex % gridColors[childIndex % gridColors.length].length
						],
					border: "1px solid #333",
					borderRadius: "4px",
					padding: "2px 4px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
					minHeight: "44px",
					cursor: "pointer",
					position: "relative",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					transform: "scale(1)",
					"&:hover": {
						transform: "scale(1.15)",
						boxShadow:
							"0 8px 20px rgba(0,0,0,0.25), 0 4px 12px rgba(33, 150, 243, 0.3)",
						borderColor: "#1976d2",
						borderWidth: "2px",
						zIndex: 10,
						backgroundColor: "#e3f2fd",
						"&::before": {
							content: '""',
							position: "absolute",
							top: "-2px",
							left: "-2px",
							right: "-2px",
							bottom: "-2px",
							background:
								"linear-gradient(45deg, rgba(33, 150, 243, 0.3), rgba(33, 150, 243, 0.1))",
							borderRadius: "6px",
							zIndex: -1,
						},
					},
					"&:active": {
						transform: "scale(1.05)",
						transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
					},
				}}>
				<Typography
					variant="caption"
					color="inherit"
					sx={{
						fontWeight: 600,
						textAlign: "center",
						color: "#333",
						fontSize: "0.44rem",
						lineHeight: 1.2,
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						padding: "2px",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "pre-wrap",
						wordBreak: "break-word",
					}}>
					{grid.label || `Service ${gridIndex + 1}`}
				</Typography>
			</Box>

			{/* Service Domain Drawer - only render if using local state */}
			{!onServiceClick && isDrawerOpen &&
				createPortal(
					<ServiceDomainDrawer
						isOpen={isDrawerOpen}
						onClose={handleCloseDrawer}
						grid={grid}
						gridIndex={gridIndex}
					/>,
					document.body
				)}
		</>
	);
};

export default ServiceDomainItem;
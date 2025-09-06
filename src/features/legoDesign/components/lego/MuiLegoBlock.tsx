/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface MuiLegoBlockProps {
	id: string;
	rows?: number;
	cols?: number;
	content: { label: string }[];
}

type Ref = any;

const MuiLegoBlock = forwardRef<Ref, MuiLegoBlockProps>(
	({ id, rows, cols, content }, ref) => {
		const [isDrawerOpen, setIsDrawerOpen] = useState(false);

		// Use provided rows/cols or determine optimal grid layout based on content count
		const getGridLayout = () => {
			if (rows && cols) {
				return { cols, rows };
			}
			
			const count = content.length;
			if (count === 1) return { cols: 1, rows: 1 };
			if (count === 2) return { cols: 2, rows: 1 };
			if (count === 3) return { cols: 3, rows: 1 };
			if (count === 4) return { cols: 2, rows: 2 };
			if (count === 5) return { cols: 3, rows: 2 };
			if (count === 6) return { cols: 3, rows: 2 };
			// For more than 6, use square-ish layout
			const calcCols = Math.ceil(Math.sqrt(count));
			const calcRows = Math.ceil(count / calcCols);
			return { cols: calcCols, rows: calcRows };
		};

		const { cols: finalCols, rows: finalRows } = getGridLayout();

		const handleBlockClick = () => {
			setIsDrawerOpen(true);
		};

		const handleCloseDrawer = () => {
			setIsDrawerOpen(false);
		};

		return (
			<>
				<div
					id={id}
					ref={ref}
					onClick={handleBlockClick}
					style={{
						width: "100%",
						height: "100%",
						backgroundColor: "#e5e7eb",
						border: "1px solid #374151",
						borderRadius: "4px",
						padding: "3px",
						display: "grid",
						gridTemplateColumns: `repeat(${finalCols}, 1fr)`,
						gridTemplateRows: `repeat(${finalRows}, 1fr)`,
						gap: "1px",
						alignItems: "center",
						justifyItems: "center",
						placeItems: "center",
						boxSizing: "border-box",
						overflow: "hidden", // Prevent overflow
						minHeight: "16px",
						cursor: "pointer",
						transition: "all 0.2s ease",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = "#d1d5db";
						e.currentTarget.style.transform = "scale(1.02)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = "#e5e7eb";
						e.currentTarget.style.transform = "scale(1)";
					}}>
				{content.map((item, index) => (
					<CircleStud
						key={index}
						item={item}
						index={index}
					/>
				))}
			</div>
			
			{/* Drawer Component */}
			{isDrawerOpen && createPortal(
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						zIndex: 9999,
						display: "flex",
						justifyContent: "flex-end",
					}}
					onClick={handleCloseDrawer}>
					<div
						style={{
							width: "400px",
							height: "100vh",
							backgroundColor: "white",
							boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.1)",
							display: "flex",
							flexDirection: "column",
							transform: "translateX(0)",
							transition: "transform 0.3s ease-in-out",
						}}
						onClick={(e) => e.stopPropagation()}>
						{/* Header */}
						<div
							style={{
								padding: "20px",
								borderBottom: "1px solid #e5e7eb",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								backgroundColor: "#f9fafb",
							}}>
							<h2
								style={{
									margin: 0,
									fontSize: "18px",
									fontWeight: "600",
									color: "#111827",
								}}>
								Block Details - {id}
							</h2>
							<button
								onClick={handleCloseDrawer}
								style={{
									background: "none",
									border: "none",
									fontSize: "24px",
									cursor: "pointer",
									color: "#6b7280",
									padding: "0",
									width: "30px",
									height: "30px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									borderRadius: "4px",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = "#e5e7eb";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = "transparent";
								}}>
								×
							</button>
						</div>

						{/* Content */}
						<div
							style={{
								flex: 1,
								padding: "20px",
								overflow: "auto",
							}}>
							<div style={{ marginBottom: "20px" }}>
								<h3
									style={{
										fontSize: "16px",
										fontWeight: "500",
										color: "#374151",
										marginBottom: "8px",
									}}>
									Block Information
								</h3>
								<div
									style={{
										backgroundColor: "#f3f4f6",
										padding: "12px",
										borderRadius: "6px",
										marginBottom: "16px",
									}}>
									<p style={{ margin: "4px 0", fontSize: "14px", color: "#6b7280" }}>
										<strong>ID:</strong> {id}
									</p>
									<p style={{ margin: "4px 0", fontSize: "14px", color: "#6b7280" }}>
										<strong>Rows:</strong> {finalRows}
									</p>
									<p style={{ margin: "4px 0", fontSize: "14px", color: "#6b7280" }}>
										<strong>Columns:</strong> {finalCols}
									</p>
									<p style={{ margin: "4px 0", fontSize: "14px", color: "#6b7280" }}>
										<strong>Total Studs:</strong> {content.length}
									</p>
								</div>
							</div>

							<div>
								<h3
									style={{
										fontSize: "16px",
										fontWeight: "500",
										color: "#374151",
										marginBottom: "12px",
									}}>
									Studs Details
								</h3>
								<div
									style={{
										display: "grid",
										gap: "8px",
									}}>
									{content.map((item, index) => (
										<div
											key={index}
											style={{
												padding: "12px",
												backgroundColor: "#f9fafb",
												border: "1px solid #e5e7eb",
												borderRadius: "6px",
												display: "flex",
												alignItems: "center",
												gap: "12px",
											}}>
											<div
												style={{
													width: "24px",
													height: "24px",
													borderRadius: "50%",
													backgroundColor: "#3b82f6",
													color: "white",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													fontSize: "12px",
													fontWeight: "600",
												}}>
												{index + 1}
											</div>
											<div>
												<p
													style={{
														margin: 0,
														fontSize: "14px",
														fontWeight: "500",
														color: "#111827",
													}}>
													{item.label || `Stud ${index + 1}`}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>,
				document.body
			)}
		</>
		);
	}
);

// Individual circle stud component with hover, click, and tooltip functionality
const CircleStud = ({ item, index }) => {
	const [isHovered, setIsHovered] = useState(false);
	const [showTooltip, setShowTooltip] = useState(false);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	const handleClick = () => {
		console.log(`Clicked circle ${index}:`, item);
		// Add your click handler logic here
	};

	return (
		<div
			style={{
				// SVG circle container with hover effects
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontWeight: "bold",
				fontSize: "8px",
				color: "#374151",
				width: "70%",
				height: "70%",
				minWidth: "6px",
				minHeight: "6px",
				maxWidth: "16px",
				maxHeight: "16px",
				aspectRatio: "1 / 1",
				flexShrink: 0,
				boxSizing: "border-box",
				overflow: "visible",
				position: "relative",
				cursor: "pointer",
				transition: "transform 0.2s ease",
				transform: isHovered ? "scale(1.15)" : "scale(1)",
			}}
			onMouseEnter={(e) => {
				setIsHovered(true);
				setShowTooltip(true);
				setMousePos({ x: e.clientX, y: e.clientY });
			}}
			onMouseMove={(e) => {
				setMousePos({ x: e.clientX, y: e.clientY });
			}}
			onMouseLeave={() => {
				setIsHovered(false);
				setShowTooltip(false);
			}}
			onClick={handleClick}
		>
			<svg
				width="100%"
				height="100%"
				viewBox="0 0 24 24"
				style={{
					display: "block",
					width: "100%",
					height: "100%",
					overflow: "visible",
				}}>
				<circle
					cx="12"
					cy="12"
					r="9"
					fill={isHovered ? "#e0f2fe" : "white"}
					stroke={isHovered ? "#0288d1" : "#374151"}
					strokeWidth={isHovered ? "1.5" : "0.8"}
					filter={isHovered ? "drop-shadow(0 0 6px rgba(2, 136, 209, 0.4))" : "none"}
				/>
			</svg>
			
			{/* Portal-based tooltip that bypasses all parent containers */}
			{showTooltip && createPortal(
				<div
					style={{
						position: "fixed",
						top: `${mousePos.y - 45}px`,
						left: `${mousePos.x}px`,
						transform: "translateX(-50%)",
						backgroundColor: "#1e293b",
						color: "white",
						padding: "6px 10px",
						borderRadius: "6px",
						fontSize: "11px",
						fontWeight: "500",
						whiteSpace: "nowrap",
						zIndex: 2147483647,
						pointerEvents: "none",
						boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
						border: "1px solid #334155",
					}}>
					{item.label || `Stud ${index + 1}`}
					{/* Tooltip arrow */}
					<div
						style={{
							position: "absolute",
							top: "100%",
							left: "50%",
							transform: "translateX(-50%)",
							width: 0,
							height: 0,
							borderLeft: "5px solid transparent",
							borderRight: "5px solid transparent",
							borderTop: "5px solid #1e293b",
						}}
					/>
				</div>,
				document.body
			)}
		</div>
	);
};

export default MuiLegoBlock;

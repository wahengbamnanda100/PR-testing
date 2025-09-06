import React, { useState } from "react";

interface DrawerComponentProps {
	isOpen: boolean;
	onClose: () => void;
	itemData: any;
	config: any;
	isHighlighted: boolean;
}

const DrawerComponent: React.FC<DrawerComponentProps> = ({
	isOpen,
	onClose,
	itemData,
	config,
	isHighlighted,
}) => {
	const [isAnimating, setIsAnimating] = useState(false);

	React.useEffect(() => {
		if (isOpen) {
			// Start animation after component mounts
			setTimeout(() => setIsAnimating(true), 10);
		}
	}, [isOpen]);

	const handleClose = () => {
		setIsAnimating(false);
		// Wait for animation to complete before closing
		setTimeout(() => onClose(), 400);
	};

	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: `rgba(0, 0, 0, ${isAnimating ? 0.5 : 0})`,
				zIndex: 10000,
				display: "flex",
				justifyContent: "flex-end",
				transition: "background-color 0.3s ease-in-out",
			}}
			onClick={handleClose}>
			<div
				style={{
					width: "450px",
					height: "100vh",
					backgroundColor: "white",
					boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.1)",
					display: "flex",
					flexDirection: "column",
					transform: `translateX(${isAnimating ? "0" : "100%"})`,
					transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
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
							fontSize: "20px",
							fontWeight: "600",
							color: "#111827",
						}}>
						{itemData.label || config.id} Details
					</h2>
					<button
						onClick={handleClose}
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
					{/* Item Overview */}
					<div style={{ marginBottom: "24px" }}>
						<h3
							style={{
								fontSize: "16px",
								fontWeight: "500",
								color: "#374151",
								marginBottom: "12px",
							}}>
							Item Overview
						</h3>
						<div
							style={{
								backgroundColor: "#f3f4f6",
								padding: "16px",
								borderRadius: "8px",
								marginBottom: "16px",
							}}>
							<div style={{ display: "grid", gap: "8px" }}>
								<p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
									<strong>ID:</strong> {config.id}
								</p>
								<p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
									<strong>Label:</strong> {itemData.label || "No label"}
								</p>
								<p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
									<strong>Flex:</strong> {config.flex || 1}
								</p>
								<p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
									<strong>Highlighted:</strong> {isHighlighted ? "Yes" : "No"}
								</p>
								<p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
									<strong>Background:</strong>{" "}
									{itemData.backgroundColor || "#f9f9f9"}
								</p>
							</div>
						</div>
					</div>

					{/* Business Domains */}
					{itemData.children && itemData.children.length > 0 && (
						<div style={{ marginBottom: "24px" }}>
							<h3
								style={{
									fontSize: "16px",
									fontWeight: "500",
									color: "#374151",
									marginBottom: "12px",
								}}>
								Business Domains ({itemData.children.length})
							</h3>
							<div style={{ display: "grid", gap: "12px" }}>
								{itemData.children.map((child: any, childIndex: number) => (
									<div
										key={childIndex}
										style={{
											padding: "16px",
											backgroundColor: "#f9fafb",
											border: "1px solid #e5e7eb",
											borderRadius: "8px",
										}}>
										<h4
											style={{
												margin: "0 0 8px 0",
												fontSize: "14px",
												fontWeight: "600",
												color: "#111827",
											}}>
											{child.subItem}
										</h4>

										{/* Service Domains */}
										{child.grids && child.grids.length > 0 && (
											<div>
												<p
													style={{
														margin: "8px 0 8px 0",
														fontSize: "12px",
														fontWeight: "500",
														color: "#6b7280",
													}}>
													Service Domains ({child.grids.length}):
												</p>
												<div
													style={{
														display: "grid",
														gridTemplateColumns:
															"repeat(auto-fill, minmax(120px, 1fr))",
														gap: "6px",
													}}>
													{child.grids.map((grid: any, gridIndex: number) => (
														<div
															key={grid.id || gridIndex}
															style={{
																padding: "6px 8px",
																backgroundColor: "#e0f2fe",
																border: "1px solid #0284c7",
																borderRadius: "4px",
																fontSize: "11px",
																fontWeight: "500",
																color: "#0c4a6e",
																textAlign: "center",
															}}>
															{grid.label || `Service ${gridIndex + 1}`}
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					)}

					{/* Statistics */}
					<div>
						<h3
							style={{
								fontSize: "16px",
								fontWeight: "500",
								color: "#374151",
								marginBottom: "12px",
							}}>
							Statistics
						</h3>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
								gap: "12px",
							}}>
							<div
								style={{
									padding: "12px",
									backgroundColor: "#dbeafe",
									borderRadius: "6px",
									textAlign: "center",
								}}>
								<div
									style={{
										fontSize: "24px",
										fontWeight: "600",
										color: "#1d4ed8",
									}}>
									{itemData.children ? itemData.children.length : 0}
								</div>
								<div
									style={{
										fontSize: "12px",
										color: "#1e40af",
										marginTop: "4px",
									}}>
									Business Domains
								</div>
							</div>
							<div
								style={{
									padding: "12px",
									backgroundColor: "#dcfce7",
									borderRadius: "6px",
									textAlign: "center",
								}}>
								<div
									style={{
										fontSize: "24px",
										fontWeight: "600",
										color: "#16a34a",
									}}>
									{itemData.children
										? itemData.children.reduce(
												(total: number, child: any) =>
													total + (child.grids ? child.grids.length : 0),
												0
										  )
										: 0}
								</div>
								<div
									style={{
										fontSize: "12px",
										color: "#15803d",
										marginTop: "4px",
									}}>
									Service Domains
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DrawerComponent;
import React, { useState } from "react";

interface ServiceDomainDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	grid: any;
	gridIndex: number;
}

const ServiceDomainDrawer: React.FC<ServiceDomainDrawerProps> = ({
	isOpen,
	onClose,
	grid,
	gridIndex,
}) => {
	const [isAnimating, setIsAnimating] = useState(false);

	React.useEffect(() => {
		if (isOpen) {
			setTimeout(() => setIsAnimating(true), 10);
		}
	}, [isOpen]);

	const handleClose = () => {
		setIsAnimating(false);
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
					width: "400px",
					height: "100vh",
					backgroundColor: "white",
					boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.1)",
					display: "flex",
					flexDirection: "column",
					transform: `translateX(${isAnimating ? '0' : '100%'})`,
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
						backgroundColor: "#f0f8ff",
					}}>
					<h2
						style={{
							margin: 0,
							fontSize: "18px",
							fontWeight: "600",
							color: "#1565c0",
						}}>
						Service Domain: {grid.label || `Service ${gridIndex + 1}`}
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
					<div style={{ marginBottom: "20px" }}>
						<h3
							style={{
								fontSize: "16px",
								fontWeight: "500",
								color: "#374151",
								marginBottom: "12px",
							}}>
							Service Information
						</h3>
						<div
							style={{
								backgroundColor: "#f8fafc",
								padding: "16px",
								borderRadius: "8px",
								border: "1px solid #e2e8f0",
							}}>
							<p style={{ margin: "8px 0", fontSize: "14px", color: "#64748b" }}>
								<strong style={{ color: "#334155" }}>Service Name:</strong>{" "}
								{grid.label || `Service ${gridIndex + 1}`}
							</p>
							<p style={{ margin: "8px 0", fontSize: "14px", color: "#64748b" }}>
								<strong style={{ color: "#334155" }}>Service ID:</strong>{" "}
								{grid.id || `service-${gridIndex}`}
							</p>
							<p style={{ margin: "8px 0", fontSize: "14px", color: "#64748b" }}>
								<strong style={{ color: "#334155" }}>Index:</strong>{" "}
								{gridIndex + 1}
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
							Service Details
						</h3>
						<div
							style={{
								backgroundColor: "#fefefe",
								padding: "16px",
								borderRadius: "8px",
								border: "1px solid #e5e7eb",
							}}>
							<p
								style={{
									margin: "0 0 12px 0",
									fontSize: "14px",
									color: "#6b7280",
									lineHeight: 1.5,
								}}>
								This service domain represents a specific business capability
								within the BIAN architecture framework. Each service domain
								encapsulates related business functions and data.
							</p>
							<div
								style={{
									display: "inline-block",
									backgroundColor: "#dbeafe",
									color: "#1e40af",
									padding: "4px 12px",
									borderRadius: "16px",
									fontSize: "12px",
									fontWeight: "500",
								}}>
								Service Domain #{gridIndex + 1}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ServiceDomainDrawer;
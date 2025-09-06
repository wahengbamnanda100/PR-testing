import React, { useState, useRef, useCallback, useEffect } from "react";
import { ServiceDomainDetails } from "../services/serviceDomainApi";
import { createPortal } from "react-dom";

interface SharedServiceDomainDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	service: any;
	serviceIndex: number;
	serviceDetails?: ServiceDomainDetails | null;
	isLoading?: boolean;
	error?: string | null;
}

// Dummy attributes data
const DUMMY_ATTRIBUTES = [
	{
		id: 1,
		title: "Head Count",
		description: "Employee count ranges",
		components: [
			{ id: "small", label: "Small (1-10)", color: "#4CAF50", selected: false },
			{ id: "medium", label: "Medium (11-50)", color: "#FF9800", selected: false },
			{ id: "large", label: "Large (>50)", color: "#F44336", selected: true }
		]
	},
	{
		id: 2,
		title: "Technology Stack",
		description: "Technology components used",
		components: [
			{ id: "react", label: "React", color: "#61DAFB", selected: true },
			{ id: "nodejs", label: "Node.js", color: "#339933", selected: false },
			{ id: "mongodb", label: "MongoDB", color: "#47A248", selected: true },
			{ id: "aws", label: "AWS", color: "#FF9900", selected: false }
		]
	},
	{
		id: 3,
		title: "Business Priority",
		description: "Priority level for business operations",
		components: [
			{ id: "critical", label: "Critical", color: "#DC2626", selected: false },
			{ id: "high", label: "High", color: "#EA580C", selected: true },
			{ id: "medium", label: "Medium", color: "#CA8A04", selected: false },
			{ id: "low", label: "Low", color: "#65A30D", selected: false }
		]
	},
	{
		id: 4,
		title: "Service Owner",
		description: "Person responsible for the service",
		components: [
			{ 
				id: "owner_text", 
				label: "Owner Name", 
				color: "#8b5cf6", 
				selected: false,
				inputType: "text",
				enteredValue: "",
				values: { placeholder: "Enter owner name..." }
			}
		]
	},
	{
		id: 5,
		title: "Performance Metrics",
		description: "Key performance indicators and thresholds",
		components: [
			{ 
				id: "response_time", 
				label: "Response Time (ms)", 
				color: "#06b6d4", 
				selected: false,
				inputType: "range",
				enteredValue: "",
				values: { 
					ranges: [
						{ label: "Fast", min: 0, max: 100, operator: "between" },
						{ label: "Acceptable", min: 100, max: 500, operator: "between" },
						{ label: "Slow", min: 500, max: null, operator: "gt" }
					]
				}
			},
			{ 
				id: "uptime", 
				label: "Uptime %", 
				color: "#10b981", 
				selected: false,
				inputType: "range",
				enteredValue: "",
				values: { 
					ranges: [
						{ label: "Excellent", min: 99.9, max: null, operator: "gte" },
						{ label: "Good", min: 99, max: 99.9, operator: "between" },
						{ label: "Poor", min: null, max: 99, operator: "lt" }
					]
				}
			}
		]
	}
];

const SharedServiceDomainDrawer: React.FC<SharedServiceDomainDrawerProps> = ({
	isOpen,
	onClose,
	service,
	serviceIndex,
	serviceDetails,
	isLoading = false,
	error,
}) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const [drawerWidth, setDrawerWidth] = useState(400);
	const [isResizing, setIsResizing] = useState(false);
	const [activeTab, setActiveTab] = useState<"details" | "actions">("details");
	const [serviceAttributes, setServiceAttributes] = useState(DUMMY_ATTRIBUTES);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [newAttribute, setNewAttribute] = useState({
		title: "",
		description: "",
		components: []
	});
	const drawerRef = useRef<HTMLDivElement>(null);
	const minWidth = 300;
	const maxWidth = 800;

	React.useEffect(() => {
		if (isOpen) {
			setTimeout(() => setIsAnimating(true), 10);
		}
	}, [isOpen]);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		setIsResizing(true);
	}, []);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (!isResizing || !drawerRef.current) return;
		
		const rect = drawerRef.current.getBoundingClientRect();
		const newWidth = window.innerWidth - e.clientX;
		const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
		setDrawerWidth(clampedWidth);
	}, [isResizing, minWidth, maxWidth]);

	const handleMouseUp = useCallback(() => {
		setIsResizing(false);
	}, []);

	useEffect(() => {
		if (isResizing) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
			document.body.style.cursor = 'col-resize';
			document.body.style.userSelect = 'none';
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			document.body.style.cursor = '';
			document.body.style.userSelect = '';
		};
	}, [isResizing, handleMouseMove, handleMouseUp]);

	const handleClose = () => {
		setIsAnimating(false);
		setTimeout(() => onClose(), 400);
	};

	// Helper function to toggle attribute component selection
	const toggleAttributeComponent = (attributeId: number, componentId: string) => {
		setServiceAttributes(prev => 
			prev.map(attr => 
				attr.id === attributeId 
					? {
						...attr,
						components: attr.components.map(comp => 
							comp.id === componentId 
								? { ...comp, selected: !comp.selected }
								: comp
						)
					}
					: attr
			)
		);
	};

	// Get selected attributes for display
	const getSelectedAttributes = () => {
		return serviceAttributes.filter(attr => 
			attr.components.some(comp => comp.selected)
		);
	};

	// Helper functions for new attribute creation
	const resetNewAttribute = () => {
		setNewAttribute({
			title: "",
			description: "",
			components: []
		});
	};

	const addComponentToNewAttribute = (componentType: string) => {
		const componentId = `comp_${Date.now()}`;
		const newComponent = {
			id: componentId,
			inputType: componentType,
			label: "",
			color: "#3B82F6",
			selected: false,
			enteredValue: "", // For text and range components
			values: componentType === "multiselect" ? { options: [] } : 
					componentType === "range" ? { ranges: [] } : 
					componentType === "text" ? { placeholder: "Enter text..." } :
					{ options: [] }
		};

		setNewAttribute(prev => ({
			...prev,
			components: [...prev.components, newComponent]
		}));
	};

	const updateNewAttributeComponent = (componentId: string, updates: any) => {
		setNewAttribute(prev => ({
			...prev,
			components: prev.components.map(comp =>
				comp.id === componentId ? { ...comp, ...updates } : comp
			)
		}));
	};

	const removeComponentFromNewAttribute = (componentId: string) => {
		setNewAttribute(prev => ({
			...prev,
			components: prev.components.filter(comp => comp.id !== componentId)
		}));
	};

	const saveNewAttribute = () => {
		if (!newAttribute.title.trim()) return;

		const attributeWithId = {
			id: Date.now(),
			...newAttribute,
			components: newAttribute.components.map(comp => ({
				...comp,
				selected: false // New attributes start unselected
			}))
		};

		setServiceAttributes(prev => [...prev, attributeWithId]);
		resetNewAttribute();
		setShowCreateModal(false);
		console.log("New attribute created:", attributeWithId);
	};

	// Responsive helper functions
	const getResponsiveFontSize = (baseSize: number) => {
		const scaleFactor = Math.max(0.8, Math.min(1.2, drawerWidth / 400));
		return `${baseSize * scaleFactor}px`;
	};

	const getResponsivePadding = (basePadding: number) => {
		const scaleFactor = Math.max(0.7, Math.min(1.3, drawerWidth / 400));
		return `${basePadding * scaleFactor}px`;
	};

	// Always render the panel container, but with 0 width when closed
	const shouldShowContent = service && isOpen;

	return (
		<>
		<div
			ref={drawerRef}
			style={{
				width: shouldShowContent && isAnimating ? `${drawerWidth}px` : "0px",
				minWidth: shouldShowContent && isAnimating ? `${drawerWidth}px` : "0px",
				maxWidth: shouldShowContent && isAnimating ? `${drawerWidth}px` : "0px",
				height: "100vh",
				backgroundColor: shouldShowContent ? "white" : "transparent",
				boxShadow: shouldShowContent && isAnimating ? "-2px 0 10px rgba(0, 0, 0, 0.1)" : "none",
				display: "flex",
				flexDirection: "column",
				transition: isResizing ? "none" : "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
				overflow: "hidden",
				borderLeft: shouldShowContent && isAnimating ? "1px solid #e5e7eb" : "none",
				position: "relative",
				zIndex: 999,
				flexShrink: 0,
			}}>
			{/* Resize Handle with Icon */}
			{shouldShowContent && isAnimating && (
				<div
					onMouseDown={handleMouseDown}
					style={{
						position: "absolute",
						left: "-6px",
						top: 0,
						bottom: 0,
						width: "12px",
						cursor: "col-resize",
						backgroundColor: isResizing ? "rgba(79, 70, 229, 0.1)" : "transparent",
						borderLeft: isResizing ? "3px solid #4f46e5" : "2px solid transparent",
						borderRadius: "0 4px 4px 0",
						transition: isResizing ? "none" : "all 0.2s ease",
						zIndex: 1000,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
					onMouseEnter={(e) => {
						if (!isResizing) {
							e.currentTarget.style.borderLeft = "3px solid #4f46e5";
							e.currentTarget.style.backgroundColor = "rgba(79, 70, 229, 0.08)";
							// Enhance icon visibility on hover
							const svg = e.currentTarget.querySelector('svg');
							if (svg) {
								svg.style.filter = "drop-shadow(0 2px 4px rgba(79, 70, 229, 0.2))";
								const circles = svg.querySelectorAll('circle');
								circles.forEach(circle => {
									circle.setAttribute('fill', '#4f46e5');
								});
							}
						}
					}}
					onMouseLeave={(e) => {
						if (!isResizing) {
							e.currentTarget.style.borderLeft = "2px solid transparent";
							e.currentTarget.style.backgroundColor = "transparent";
							// Reset icon on mouse leave
							const svg = e.currentTarget.querySelector('svg');
							if (svg) {
								svg.style.filter = "none";
								const circles = svg.querySelectorAll('circle');
								circles.forEach(circle => {
									circle.setAttribute('fill', '#9ca3af');
								});
							}
						}
					}}>
					{/* Resize Icon */}
					<div
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							opacity: isResizing ? 1 : 0.6,
							transition: "opacity 0.2s ease",
						}}>
						{/* Three vertical dots indicating resize */}
						<svg
							width="8"
							height="24"
							viewBox="0 0 8 24"
							fill="none"
							style={{
								filter: isResizing ? "drop-shadow(0 2px 4px rgba(79, 70, 229, 0.3))" : "none",
								animation: "slideIn 0.3s ease-out",
							}}>
							<circle cx="2" cy="6" r="1" fill={isResizing ? "#4f46e5" : "#9ca3af"} />
							<circle cx="6" cy="6" r="1" fill={isResizing ? "#4f46e5" : "#9ca3af"} />
							<circle cx="2" cy="12" r="1" fill={isResizing ? "#4f46e5" : "#9ca3af"} />
							<circle cx="6" cy="12" r="1" fill={isResizing ? "#4f46e5" : "#9ca3af"} />
							<circle cx="2" cy="18" r="1" fill={isResizing ? "#4f46e5" : "#9ca3af"} />
							<circle cx="6" cy="18" r="1" fill={isResizing ? "#4f46e5" : "#9ca3af"} />
						</svg>
					</div>

					{/* Animated Resize Indicator */}
					{isResizing && (
						<div
							style={{
								position: "absolute",
								left: "-2px",
								top: "50%",
								transform: "translateY(-50%)",
								width: "16px",
								height: "60px",
								background: "linear-gradient(90deg, rgba(79, 70, 229, 0.8), rgba(79, 70, 229, 0.3), transparent)",
								borderRadius: "8px 0 0 8px",
								animation: "pulse 1s ease-in-out infinite alternate",
								zIndex: -1,
							}}
						/>
					)}
				</div>
			)}
			{/* Header - only show when panel is open */}
			{shouldShowContent && isAnimating && (
				<div
					style={{
						padding: getResponsivePadding(20),
						borderBottom: "1px solid #e5e7eb",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						backgroundColor: "#f0f8ff",
						minHeight: `${Math.max(60, Math.min(80, drawerWidth * 0.2))}px`,
						flexShrink: 0,
					}}>
					<h2
						style={{
							margin: 0,
							fontSize: getResponsiveFontSize(18),
							fontWeight: "600",
							color: "#1565c0",
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
							maxWidth: `${drawerWidth - 100}px`,
						}}>
						{serviceDetails?.name || service.name || service.label || `Service Domain ${serviceIndex + 1}`}
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
							flexShrink: 0,
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
			)}

			{/* Tab Navigation - only show when panel is open */}
			{shouldShowContent && isAnimating && (
				<div
					style={{
						borderBottom: "1px solid #e5e7eb",
						backgroundColor: "#fafbfc",
						display: "flex",
						padding: `0 ${getResponsivePadding(20)}`,
						flexShrink: 0,
					}}>
					<button
						onClick={() => setActiveTab("details")}
						style={{
							padding: `${getResponsivePadding(12)} ${getResponsivePadding(16)}`,
							border: "none",
							background: "none",
							cursor: "pointer",
							fontSize: getResponsiveFontSize(14),
							fontWeight: activeTab === "details" ? "600" : "500",
							color: activeTab === "details" ? "#1565c0" : "#6b7280",
							borderBottom: activeTab === "details" ? "2px solid #1565c0" : "2px solid transparent",
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							if (activeTab !== "details") {
								e.currentTarget.style.color = "#374151";
							}
						}}
						onMouseLeave={(e) => {
							if (activeTab !== "details") {
								e.currentTarget.style.color = "#6b7280";
							}
						}}>
						Details
					</button>
					<button
						onClick={() => setActiveTab("actions")}
						style={{
							padding: `${getResponsivePadding(12)} ${getResponsivePadding(16)}`,
							border: "none",
							background: "none",
							cursor: "pointer",
							fontSize: getResponsiveFontSize(14),
							fontWeight: activeTab === "actions" ? "600" : "500",
							color: activeTab === "actions" ? "#1565c0" : "#6b7280",
							borderBottom: activeTab === "actions" ? "2px solid #1565c0" : "2px solid transparent",
							transition: "all 0.2s ease",
						}}
						onMouseEnter={(e) => {
							if (activeTab !== "actions") {
								e.currentTarget.style.color = "#374151";
							}
						}}
						onMouseLeave={(e) => {
							if (activeTab !== "actions") {
								e.currentTarget.style.color = "#6b7280";
							}
						}}>
						Actions
					</button>
				</div>
			)}

			{/* Content - only show when panel is open */}
			{shouldShowContent && isAnimating && (
				<div
					style={{
						flex: 1,
						padding: getResponsivePadding(20),
						overflow: "auto",
						width: "100%",
						boxSizing: "border-box",
					}}>
					{/* Loading State */}
					{isLoading && (
						<div style={{ 
							display: "flex", 
							alignItems: "center", 
							justifyContent: "center", 
							padding: "40px",
							color: "#6b7280" 
						}}>
							<div style={{ textAlign: "center" }}>
								<div style={{ 
									width: "32px", 
									height: "32px", 
									border: "3px solid #e5e7eb",
									borderTop: "3px solid #3b82f6",
									borderRadius: "50%",
									animation: "spin 1s linear infinite",
									margin: "0 auto 12px"
								}}></div>
								<p style={{ margin: 0, fontSize: getResponsiveFontSize(14) }}>Loading service domain details...</p>
							</div>
						</div>
					)}

					{/* Error State */}
					{error && !isLoading && (
						<div style={{
							padding: "16px",
							backgroundColor: "#fef2f2",
							borderRadius: "8px",
							border: "1px solid #fecaca",
							marginBottom: "20px"
						}}>
							<h3 style={{ 
								margin: "0 0 8px 0", 
								fontSize: "16px", 
								color: "#dc2626",
								fontWeight: "600" 
							}}>
								Error Loading Service Domain
							</h3>
							<p style={{ 
								margin: 0, 
								fontSize: "14px", 
								color: "#7f1d1d" 
							}}>
								{error}
							</p>
						</div>
					)}

					{/* Details Tab Content */}
					{activeTab === "details" && !isLoading && !error && serviceDetails && (
						<div>
							{/* Basic Information */}
							<div style={{ marginBottom: "24px" }}>
								<h3 style={{
									fontSize: "16px",
									fontWeight: "600",
									color: "#374151",
									marginBottom: "12px",
								}}>
									Basic Information
								</h3>
								<div style={{
									backgroundColor: "#f8fafc",
									padding: "16px",
									borderRadius: "8px",
									border: "1px solid #e2e8f0",
								}}>
									<p style={{ margin: "8px 0", fontSize: "14px", color: "#64748b" }}>
										<strong style={{ color: "#334155" }}>Service Name:</strong>{" "}
										{serviceDetails.name}
									</p>
									<p style={{ margin: "8px 0", fontSize: "14px", color: "#64748b" }}>
										<strong style={{ color: "#334155" }}>Service UID:</strong>{" "}
										{service.uid || service.id || `service-${serviceIndex}`}
									</p>
								</div>
							</div>

							{/* Executive Summary */}
							{serviceDetails.executiveSummary && (
								<div style={{ marginBottom: "24px" }}>
									<h3 style={{
										fontSize: "16px",
										fontWeight: "600",
										color: "#374151",
										marginBottom: "12px",
									}}>
										Executive Summary
									</h3>
									<div style={{
										backgroundColor: "#fefefe",
										padding: "16px",
										borderRadius: "8px",
										border: "1px solid #e5e7eb",
									}}>
										<p style={{
											margin: 0,
											fontSize: "14px",
											color: "#4b5563",
											lineHeight: 1.6,
										}}>
											{serviceDetails.executiveSummary}
										</p>
									</div>
								</div>
							)}

							{/* Role Definition */}
							{serviceDetails.roleDefinition && (
								<div style={{ marginBottom: "24px" }}>
									<h3 style={{
										fontSize: "16px",
										fontWeight: "600",
										color: "#374151",
										marginBottom: "12px",
									}}>
										Role Definition
									</h3>
									<div style={{
										backgroundColor: "#f0f9ff",
										padding: "16px",
										borderRadius: "8px",
										border: "1px solid #0ea5e9",
									}}>
										<p style={{
											margin: 0,
											fontSize: "14px",
											color: "#0c4a6e",
											lineHeight: 1.6,
										}}>
											{serviceDetails.roleDefinition}
										</p>
									</div>
								</div>
							)}

							{/* Key Features */}
							{serviceDetails.keyFeatures && serviceDetails.keyFeatures.length > 0 && (
								<div style={{ marginBottom: "24px" }}>
									<h3 style={{
										fontSize: "16px",
										fontWeight: "600",
										color: "#374151",
										marginBottom: "12px",
									}}>
										Key Features
									</h3>
									<div style={{
										backgroundColor: "#f0fdf4",
										padding: "16px",
										borderRadius: "8px",
										border: "1px solid #bbf7d0",
									}}>
										<ul style={{
											margin: 0,
											paddingLeft: "20px",
											color: "#166534",
										}}>
											{serviceDetails.keyFeatures.map((feature, index) => (
												<li key={index} style={{
													fontSize: "14px",
													marginBottom: "6px",
													lineHeight: 1.5,
												}}>
													{feature}
												</li>
											))}
										</ul>
									</div>
								</div>
							)}

							{/* Example of Use */}
							{serviceDetails.exampleofuse && (
								<div style={{ marginBottom: "24px" }}>
									<h3 style={{
										fontSize: "16px",
										fontWeight: "600",
										color: "#374151",
										marginBottom: "12px",
									}}>
										Example of Use
									</h3>
									<div style={{
										backgroundColor: "#fefbeb",
										padding: "16px",
										borderRadius: "8px",
										border: "1px solid #fed7aa",
									}}>
										<p style={{
											margin: 0,
											fontSize: "14px",
											color: "#92400e",
											lineHeight: 1.6,
										}}>
											{serviceDetails.exampleofuse}
										</p>
									</div>
								</div>
							)}
						</div>
					)}

					{/* Actions Tab Content */}
					{activeTab === "actions" && !isLoading && !error && (
						<div>
							{/* Actions Header */}
							<div style={{ marginBottom: "24px" }}>
								<h3 style={{
									fontSize: "16px",
									fontWeight: "600",
									color: "#374151",
									marginBottom: "8px",
								}}>
									Service Domain Actions
								</h3>
								<p style={{
									fontSize: "14px",
									color: "#6b7280",
									margin: 0,
									lineHeight: 1.5,
								}}>
									Manage attributes and configurations for this service domain
								</p>
							</div>

							{/* Add Attributes Section */}
							<div style={{ marginBottom: "32px" }}>
								<div style={{
									backgroundColor: "#f8fafc",
									padding: "20px",
									borderRadius: "8px",
									border: "1px solid #e2e8f0",
								}}>
									<h4 style={{
										fontSize: "14px",
										fontWeight: "600",
										color: "#374151",
										marginBottom: "12px",
										display: "flex",
										alignItems: "center",
										gap: "8px",
									}}>
										<span style={{
											display: "inline-block",
											width: "20px",
											height: "20px",
											borderRadius: "50%",
											backgroundColor: "#3b82f6",
											color: "white",
											fontSize: "12px",
											textAlign: "center",
											lineHeight: "20px",
										}}>+</span>
										Manage Attributes
									</h4>
									<p style={{
										fontSize: "13px",
										color: "#64748b",
										margin: "0 0 16px 0",
										lineHeight: 1.4,
									}}>
										Assign existing attributes or create new custom attributes to track specific characteristics, technologies, or business metrics.
									</p>
									<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
										<button
											style={{
												backgroundColor: "#3b82f6",
												color: "white",
												border: "none",
												padding: "8px 16px",
												borderRadius: "6px",
												fontSize: "13px",
												fontWeight: "500",
												cursor: "pointer",
												transition: "all 0.2s ease",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = "#2563eb";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = "#3b82f6";
											}}
											onClick={() => {
												console.log("Configure Attributes clicked, opening modal...");
												setShowAddModal(true);
											}}>
											Configure Existing
										</button>
										<button
											style={{
												backgroundColor: "#10b981",
												color: "white",
												border: "none",
												padding: "8px 16px",
												borderRadius: "6px",
												fontSize: "13px",
												fontWeight: "500",
												cursor: "pointer",
												transition: "all 0.2s ease",
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.backgroundColor = "#059669";
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.backgroundColor = "#10b981";
											}}
											onClick={() => {
												console.log("Create New Attribute clicked, opening creation modal...");
												resetNewAttribute();
												setShowCreateModal(true);
											}}>
											Create New Attribute
										</button>
									</div>
								</div>
							</div>

							{/* Current Attributes Section */}
							<div style={{ marginBottom: "24px" }}>
								<h4 style={{
									fontSize: "14px",
									fontWeight: "600",
									color: "#374151",
									marginBottom: "12px",
								}}>
									Current Attributes ({getSelectedAttributes().length})
								</h4>
								{/* Show all attributes with their components for direct editing */}
								<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
									{serviceAttributes.map(attr => (
										<div
											key={attr.id}
											style={{
												backgroundColor: "#fefefe",
												padding: "16px",
												borderRadius: "8px",
												border: "1px solid #e5e7eb",
											}}>
											<div style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "flex-start",
												marginBottom: "12px",
											}}>
												<div>
													<h5 style={{
														fontSize: "14px",
														fontWeight: "600",
														color: "#374151",
														margin: 0,
														marginBottom: "4px",
													}}>
														{attr.title}
													</h5>
													<p style={{
														fontSize: "12px",
														color: "#6b7280",
														margin: 0,
													}}>
														{attr.description}
													</p>
												</div>
												<span style={{
													fontSize: "10px",
													color: "#6b7280",
													backgroundColor: "#f3f4f6",
													padding: "4px 8px",
													borderRadius: "12px",
													fontWeight: "500",
												}}>
													{attr.components.filter(c => c.selected).length} of {attr.components.length} selected
												</span>
											</div>

											{/* Interactive Components */}
											<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
												{attr.components.map(comp => (
													<div key={comp.id} style={{
														backgroundColor: comp.selected ? "#f0f9ff" : "#f8fafc",
														padding: "12px",
														borderRadius: "8px",
														border: comp.selected ? `2px solid ${comp.color}` : "1px solid #e2e8f0",
														transition: "all 0.2s ease",
													}}>
														<div style={{
															display: "flex",
															alignItems: "center",
															gap: "8px",
															marginBottom: comp.selected ? "10px" : "0px",
														}}>
															{/* Toggle Button */}
															<button
																onClick={() => toggleAttributeComponent(attr.id, comp.id)}
																style={{
																	backgroundColor: comp.selected ? comp.color : "transparent",
																	color: comp.selected ? "white" : comp.color,
																	border: `2px solid ${comp.color}`,
																	borderRadius: "6px",
																	padding: "6px 12px",
																	fontSize: "11px",
																	fontWeight: "600",
																	cursor: "pointer",
																	transition: "all 0.2s ease",
																	textShadow: comp.selected ? "0 1px 1px rgba(0,0,0,0.1)" : "none",
																}}
																onMouseEnter={(e) => {
																	if (!comp.selected) {
																		e.currentTarget.style.backgroundColor = comp.color + "15";
																	}
																}}
																onMouseLeave={(e) => {
																	if (!comp.selected) {
																		e.currentTarget.style.backgroundColor = "transparent";
																	}
																}}>
																{comp.selected ? "✓ " : ""}{comp.label}
															</button>

															<span style={{
																fontSize: "9px",
																color: "#6b7280",
																backgroundColor: "#e5e7eb",
																padding: "2px 6px",
																borderRadius: "10px",
																fontWeight: "500",
																textTransform: "uppercase",
															}}>
																{comp.inputType}
															</span>
														</div>

														{/* Interactive Content for Selected Components */}
														{comp.selected && (
															<div>
																{/* Text Input */}
																{comp.inputType === "text" && (
																	<div>
																		<input
																			type="text"
																			value={comp.enteredValue || ""}
																			onChange={(e) => {
																				setServiceAttributes(prev => 
																					prev.map(a => 
																						a.id === attr.id 
																							? {
																								...a,
																								components: a.components.map(c => 
																									c.id === comp.id 
																										? { ...c, enteredValue: e.target.value }
																										: c
																								)
																							}
																							: a
																					)
																				);
																			}}
																			placeholder={comp.values?.placeholder || "Enter text..."}
																			style={{
																				width: "100%",
																				padding: "8px 12px",
																				border: `1px solid ${comp.color}`,
																				borderRadius: "6px",
																				fontSize: "12px",
																				outline: "none",
																				backgroundColor: "white",
																				boxSizing: "border-box",
																			}}
																		/>
																	</div>
																)}

																{/* Range Input */}
																{comp.inputType === "range" && (
																	<div>
																		<input
																			type="number"
																			value={comp.enteredValue || ""}
																			onChange={(e) => {
																				setServiceAttributes(prev => 
																					prev.map(a => 
																						a.id === attr.id 
																							? {
																								...a,
																								components: a.components.map(c => 
																									c.id === comp.id 
																										? { ...c, enteredValue: e.target.value }
																										: c
																								)
																							}
																							: a
																					)
																				);
																			}}
																			placeholder="Enter value..."
																			style={{
																				width: "100%",
																				padding: "8px 12px",
																				border: `1px solid ${comp.color}`,
																				borderRadius: "6px",
																				fontSize: "12px",
																				outline: "none",
																				backgroundColor: "white",
																				boxSizing: "border-box",
																				marginBottom: "8px",
																			}}
																		/>
																		{/* Show range definitions */}
																		{comp.values?.ranges && (
																			<div>
																				<div style={{
																					fontSize: "10px",
																					color: "#6b7280",
																					marginBottom: "4px",
																					fontWeight: "500",
																				}}>
																					Range Definitions:
																				</div>
																				<div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
																					{comp.values.ranges.map((range: any, rangeIndex: number) => (
																						<span
																							key={rangeIndex}
																							style={{
																								backgroundColor: "white",
																								color: comp.color,
																								border: `1px solid ${comp.color}`,
																								borderRadius: "6px",
																								padding: "4px 8px",
																								fontSize: "9px",
																								fontWeight: "500",
																							}}>
																							{range.label}: {range.operator === "between" 
																								? `${range.min}-${range.max}`
																								: range.operator === "gt" 
																								? `>${range.min}`
																								: range.operator === "lt" 
																								? `<${range.max}`
																								: range.operator === "gte" 
																								? `≥${range.min}`
																								: range.operator === "lte" 
																								? `≤${range.max}`
																								: `${range.operator}${range.min || range.max}`
																							}
																						</span>
																					))}
																				</div>
																			</div>
																		)}
																	</div>
																)}

																{/* List/Multiselect Options */}
																{(comp.inputType === "list" || comp.inputType === "multiselect") && comp.values?.options && (
																	<div>
																		<div style={{
																			fontSize: "11px",
																			color: "#6b7280",
																			marginBottom: "6px",
																			fontWeight: "500",
																		}}>
																			{comp.inputType === "list" ? "Select one:" : "Select multiple:"}
																		</div>
																		<div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
																			{comp.values.options.map((option: string, optIndex: number) => {
																				const isOptionSelected = comp.selectedOptions?.includes(option) || false;
																				return (
																					<button
																						key={optIndex}
																						onClick={() => {
																							setServiceAttributes(prev => 
																								prev.map(a => 
																									a.id === attr.id 
																										? {
																											...a,
																											components: a.components.map(c => {
																												if (c.id === comp.id) {
																													let newSelectedOptions = c.selectedOptions || [];
																													if (comp.inputType === "list") {
																														// Single select - replace selection
																														newSelectedOptions = [option];
																													} else {
																														// Multi-select - toggle option
																														if (isOptionSelected) {
																															newSelectedOptions = newSelectedOptions.filter(opt => opt !== option);
																														} else {
																															newSelectedOptions = [...newSelectedOptions, option];
																														}
																													}
																													return { ...c, selectedOptions: newSelectedOptions };
																												}
																												return c;
																											})
																										}
																										: a
																								)
																							);
																						}}
																						style={{
																							backgroundColor: isOptionSelected ? comp.color : "white",
																							color: isOptionSelected ? "white" : comp.color,
																							border: `2px solid ${comp.color}`,
																							borderRadius: "6px",
																							padding: "6px 12px",
																							fontSize: "11px",
																							fontWeight: "500",
																							cursor: "pointer",
																							transition: "all 0.2s ease",
																							textShadow: isOptionSelected ? "0 1px 1px rgba(0,0,0,0.1)" : "none",
																						}}
																						onMouseEnter={(e) => {
																							if (!isOptionSelected) {
																								e.currentTarget.style.backgroundColor = comp.color + "15";
																							}
																						}}
																						onMouseLeave={(e) => {
																							if (!isOptionSelected) {
																								e.currentTarget.style.backgroundColor = "white";
																							}
																						}}>
																						{isOptionSelected ? "✓ " : ""}{option}
																					</button>
																				);
																			})}
																		</div>
																		{/* Show selected options count */}
																		{comp.selectedOptions && comp.selectedOptions.length > 0 && (
																			<div style={{
																				fontSize: "10px",
																				color: "#059669",
																				backgroundColor: "#ecfdf5",
																				padding: "4px 8px",
																				borderRadius: "6px",
																				border: "1px solid #a7f3d0",
																				marginTop: "6px",
																				fontWeight: "500",
																			}}>
																				Selected: {comp.selectedOptions.join(", ")}
																			</div>
																		)}
																	</div>
																)}
															</div>
														)}
													</div>
												))}
											</div>
										</div>
									))}

									{/* Add New Attribute Prompt */}
									{serviceAttributes.length === 0 && (
										<div style={{
											backgroundColor: "#f9fafb",
											padding: "20px",
											borderRadius: "8px",
											border: "2px dashed #d1d5db",
											textAlign: "center",
										}}>
											<p style={{
												fontSize: "14px",
												color: "#6b7280",
												margin: "0 0 12px 0",
											}}>
												No attributes created yet.
											</p>
											<button
												onClick={() => {
													resetNewAttribute();
													setShowCreateModal(true);
												}}
												style={{
													backgroundColor: "#10b981",
													color: "white",
													border: "none",
													padding: "8px 16px",
													borderRadius: "6px",
													fontSize: "13px",
													fontWeight: "500",
													cursor: "pointer",
												}}>
												Create Your First Attribute
											</button>
										</div>
									)}
								</div>
							</div>

							{/* Additional Actions */}
							<div>
								<h4 style={{
									fontSize: "14px",
									fontWeight: "600",
									color: "#374151",
									marginBottom: "12px",
								}}>
									Additional Actions
								</h4>
								<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
									<button
										style={{
											backgroundColor: "transparent",
											color: "#6b7280",
											border: "1px solid #d1d5db",
											padding: "10px 16px",
											borderRadius: "6px",
											fontSize: "13px",
											fontWeight: "500",
											cursor: "pointer",
											transition: "all 0.2s ease",
											textAlign: "left",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = "#f9fafb";
											e.currentTarget.style.borderColor = "#9ca3af";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = "transparent";
											e.currentTarget.style.borderColor = "#d1d5db";
										}}
										onClick={() => {
											// TODO: Implement export functionality
											console.log("Export service domain:", service);
										}}>
										📤 Export Configuration
									</button>
									<button
										style={{
											backgroundColor: "transparent",
											color: "#6b7280",
											border: "1px solid #d1d5db",
											padding: "10px 16px",
											borderRadius: "6px",
											fontSize: "13px",
											fontWeight: "500",
											cursor: "pointer",
											transition: "all 0.2s ease",
											textAlign: "left",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = "#f9fafb";
											e.currentTarget.style.borderColor = "#9ca3af";
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = "transparent";
											e.currentTarget.style.borderColor = "#d1d5db";
										}}
										onClick={() => {
											// TODO: Implement duplicate functionality
											console.log("Duplicate service domain:", service);
										}}>
										📋 Duplicate to Another Map
									</button>
								</div>
							</div>
						</div>
					)}


					{/* Navigation hint - show on both tabs */}
					{!isLoading && !error && (
						<div
							style={{
								marginTop: getResponsivePadding(20),
								padding: getResponsivePadding(12),
								backgroundColor: "#f0f9ff",
								borderRadius: "8px",
								border: "1px solid #0ea5e9",
							}}>
							<p
								style={{
									margin: 0,
									fontSize: getResponsiveFontSize(12),
									color: "#0369a1",
									fontWeight: "500",
									lineHeight: 1.4,
									wordBreak: "break-word",
								}}>
								💡 Tip: This panel is resizable! Drag the left edge to adjust width. Switch between tabs to view details or manage actions.
							</p>
						</div>
					)}
				</div>
			)}
			{/* Loading animation keyframes */}
			<style>{`
				@keyframes spin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
				
				@keyframes pulse {
					0% { 
						opacity: 0.6;
						transform: translateY(-50%) scaleY(0.8);
					}
					100% { 
						opacity: 1;
						transform: translateY(-50%) scaleY(1);
					}
				}
				
				@keyframes slideIn {
					0% { 
						transform: translate(-50%, -50%) scale(0.8);
						opacity: 0;
					}
					100% { 
						transform: translate(-50%, -50%) scale(1);
						opacity: 1;
					}
				}
			`}</style>
		</div>

		{/* Attribute Configuration Modal - rendered outside drawer using portal */}
		{showAddModal && createPortal(
			<div style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 9999,
			}}>
				<div style={{
					backgroundColor: "white",
					borderRadius: "12px",
					padding: "24px",
					maxWidth: "500px",
					width: "90%",
					maxHeight: "80vh",
					overflow: "auto",
					boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
				}}>
					<div style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "20px",
					}}>
						<h3 style={{
							fontSize: "18px",
							fontWeight: "600",
							color: "#374151",
							margin: 0,
						}}>
							Configure Attributes
						</h3>
						<button
							onClick={() => setShowAddModal(false)}
							style={{
								background: "none",
								border: "none",
								fontSize: "24px",
								cursor: "pointer",
								color: "#6b7280",
								padding: "4px",
							}}>
							×
						</button>
					</div>
					
					<p style={{
						fontSize: "14px",
						color: "#6b7280",
						margin: "0 0 20px 0",
						lineHeight: 1.5,
					}}>
						Select the attributes and their values that apply to this service domain.
					</p>

					{/* Attribute List */}
					<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
						{serviceAttributes.map(attr => (
							<div
								key={attr.id}
								style={{
									border: "1px solid #e5e7eb",
									borderRadius: "8px",
									padding: "16px",
								}}>
								<div style={{ marginBottom: "12px" }}>
									<h4 style={{
										fontSize: "14px",
										fontWeight: "600",
										color: "#374151",
										margin: 0,
										marginBottom: "4px",
									}}>
										{attr.title}
									</h4>
									<p style={{
										fontSize: "12px",
										color: "#6b7280",
										margin: 0,
									}}>
										{attr.description}
									</p>
								</div>
								<div style={{
									display: "flex",
									flexWrap: "wrap",
									gap: "8px",
								}}>
									{attr.components.map(comp => (
										<div key={comp.id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
											{/* Component Button */}
											<button
												onClick={() => {
													console.log("Toggling component:", attr.title, comp.label);
													toggleAttributeComponent(attr.id, comp.id);
												}}
												style={{
													backgroundColor: comp.selected ? comp.color : "transparent",
													color: comp.selected ? "white" : comp.color,
													border: `2px solid ${comp.color}`,
													borderRadius: "6px",
													padding: "6px 12px",
													fontSize: "12px",
													fontWeight: "500",
													cursor: "pointer",
													transition: "all 0.2s ease",
													textShadow: comp.selected ? "0 1px 1px rgba(0,0,0,0.1)" : "none",
												}}
												onMouseEnter={(e) => {
													if (!comp.selected) {
														e.currentTarget.style.backgroundColor = comp.color + "15";
													}
												}}
												onMouseLeave={(e) => {
													if (!comp.selected) {
														e.currentTarget.style.backgroundColor = "transparent";
													}
												}}>
												{comp.label}
											</button>
											
											{/* Text Input for text and range components when selected */}
											{comp.selected && (comp.inputType === "text" || comp.inputType === "range") && (
												<input
													type={comp.inputType === "range" ? "number" : "text"}
													value={comp.enteredValue || ""}
													onChange={(e) => {
														// Update the entered value for this component
														setServiceAttributes(prev => 
															prev.map(a => 
																a.id === attr.id 
																	? {
																		...a,
																		components: a.components.map(c => 
																			c.id === comp.id 
																				? { ...c, enteredValue: e.target.value }
																				: c
																		)
																	}
																	: a
															)
														);
													}}
													placeholder={
														comp.inputType === "text" 
															? (comp.values?.placeholder || "Enter text...") 
															: "Enter value..."
													}
													style={{
														width: "120px",
														padding: "4px 6px",
														border: `1px solid ${comp.color}`,
														borderRadius: "4px",
														fontSize: "11px",
														outline: "none",
														backgroundColor: "white",
													}}
												/>
											)}
										</div>
									))}
								</div>
							</div>
						))}
					</div>

					{/* Modal Actions */}
					<div style={{
						display: "flex",
						justifyContent: "flex-end",
						gap: "12px",
						marginTop: "24px",
						paddingTop: "20px",
						borderTop: "1px solid #e5e7eb",
					}}>
						<button
							onClick={() => {
								console.log("Cancel clicked, closing modal");
								setShowAddModal(false);
							}}
							style={{
								backgroundColor: "transparent",
								color: "#6b7280",
								border: "1px solid #d1d5db",
								padding: "8px 16px",
								borderRadius: "6px",
								fontSize: "14px",
								fontWeight: "500",
								cursor: "pointer",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#f9fafb";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "transparent";
							}}>
							Cancel
						</button>
						<button
							onClick={() => {
								console.log("Save clicked, attributes saved for service:", service.name);
								setShowAddModal(false);
								// Attributes are already updated in real-time via toggleAttributeComponent
							}}
							style={{
								backgroundColor: "#3b82f6",
								color: "white",
								border: "none",
								padding: "8px 16px",
								borderRadius: "6px",
								fontSize: "14px",
								fontWeight: "500",
								cursor: "pointer",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = "#2563eb";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = "#3b82f6";
							}}>
							Save Changes
						</button>
					</div>
				</div>
			</div>,
			document.body
		)}

		{/* Create New Attribute Modal */}
		{showCreateModal && createPortal(
			<div style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 10000,
			}}>
				<div style={{
					backgroundColor: "white",
					borderRadius: "12px",
					padding: "24px",
					maxWidth: "600px",
					width: "95%",
					maxHeight: "85vh",
					overflow: "auto",
					boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
				}}>
					{/* Header */}
					<div style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "24px",
					}}>
						<h3 style={{
							fontSize: "20px",
							fontWeight: "600",
							color: "#374151",
							margin: 0,
						}}>
							Create New Attribute
						</h3>
						<button
							onClick={() => {
								setShowCreateModal(false);
								resetNewAttribute();
							}}
							style={{
								background: "none",
								border: "none",
								fontSize: "24px",
								cursor: "pointer",
								color: "#6b7280",
								padding: "4px",
							}}>
							×
						</button>
					</div>

					{/* Attribute Basic Info */}
					<div style={{ marginBottom: "24px" }}>
						<div style={{ marginBottom: "16px" }}>
							<label style={{
								display: "block",
								fontSize: "14px",
								fontWeight: "500",
								color: "#374151",
								marginBottom: "6px",
							}}>
								Attribute Title *
							</label>
							<input
								type="text"
								value={newAttribute.title}
								onChange={(e) => setNewAttribute(prev => ({ ...prev, title: e.target.value }))}
								placeholder="e.g., Team Size, Technology Stack, Risk Level"
								style={{
									width: "100%",
									padding: "8px 12px",
									border: "1px solid #d1d5db",
									borderRadius: "6px",
									fontSize: "14px",
									boxSizing: "border-box",
								}}
							/>
						</div>
						<div style={{ marginBottom: "16px" }}>
							<label style={{
								display: "block",
								fontSize: "14px",
								fontWeight: "500",
								color: "#374151",
								marginBottom: "6px",
							}}>
								Description
							</label>
							<textarea
								value={newAttribute.description}
								onChange={(e) => setNewAttribute(prev => ({ ...prev, description: e.target.value }))}
								placeholder="Describe what this attribute tracks..."
								rows={2}
								style={{
									width: "100%",
									padding: "8px 12px",
									border: "1px solid #d1d5db",
									borderRadius: "6px",
									fontSize: "14px",
									boxSizing: "border-box",
									resize: "vertical",
								}}
							/>
						</div>
					</div>

					{/* Components Section */}
					<div style={{ marginBottom: "24px" }}>
						<div style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "16px",
						}}>
							<h4 style={{
								fontSize: "16px",
								fontWeight: "600",
								color: "#374151",
								margin: 0,
							}}>
								Components ({newAttribute.components.length})
							</h4>
							<div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
								<button
									onClick={() => addComponentToNewAttribute("list")}
									style={{
										backgroundColor: "#3b82f6",
										color: "white",
										border: "none",
										padding: "4px 8px",
										borderRadius: "4px",
										fontSize: "12px",
										cursor: "pointer",
									}}>
									+ List
								</button>
								<button
									onClick={() => addComponentToNewAttribute("multiselect")}
									style={{
										backgroundColor: "#10b981",
										color: "white",
										border: "none",
										padding: "4px 8px",
										borderRadius: "4px",
										fontSize: "12px",
										cursor: "pointer",
									}}>
									+ Multi-Select
								</button>
								<button
									onClick={() => addComponentToNewAttribute("range")}
									style={{
										backgroundColor: "#f59e0b",
										color: "white",
										border: "none",
										padding: "4px 8px",
										borderRadius: "4px",
										fontSize: "12px",
										cursor: "pointer",
									}}>
									+ Range
								</button>
								<button
									onClick={() => addComponentToNewAttribute("text")}
									style={{
										backgroundColor: "#8b5cf6",
										color: "white",
										border: "none",
										padding: "4px 8px",
										borderRadius: "4px",
										fontSize: "12px",
										cursor: "pointer",
									}}>
									+ Text
								</button>
							</div>
						</div>

						{/* Components List */}
						<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
							{newAttribute.components.map((component, index) => (
								<ComponentEditor
									key={component.id}
									component={component}
									index={index}
									onUpdate={(updates) => updateNewAttributeComponent(component.id, updates)}
									onRemove={() => removeComponentFromNewAttribute(component.id)}
								/>
							))}
							{newAttribute.components.length === 0 && (
								<div style={{
									padding: "20px",
									textAlign: "center",
									backgroundColor: "#f9fafb",
									borderRadius: "8px",
									border: "2px dashed #d1d5db",
								}}>
									<p style={{
										fontSize: "14px",
										color: "#6b7280",
										margin: 0,
									}}>
										No components added yet. Click the buttons above to add List, Multi-Select, or Range components.
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Modal Actions */}
					<div style={{
						display: "flex",
						justifyContent: "flex-end",
						gap: "12px",
						paddingTop: "20px",
						borderTop: "1px solid #e5e7eb",
					}}>
						<button
							onClick={() => {
								setShowCreateModal(false);
								resetNewAttribute();
							}}
							style={{
								backgroundColor: "transparent",
								color: "#6b7280",
								border: "1px solid #d1d5db",
								padding: "8px 16px",
								borderRadius: "6px",
								fontSize: "14px",
								fontWeight: "500",
								cursor: "pointer",
							}}>
							Cancel
						</button>
						<button
							onClick={saveNewAttribute}
							disabled={!newAttribute.title.trim()}
							style={{
								backgroundColor: newAttribute.title.trim() ? "#10b981" : "#9ca3af",
								color: "white",
								border: "none",
								padding: "8px 16px",
								borderRadius: "6px",
								fontSize: "14px",
								fontWeight: "500",
								cursor: newAttribute.title.trim() ? "pointer" : "not-allowed",
							}}>
							Create Attribute
						</button>
					</div>
				</div>
			</div>,
			document.body
		)}
	</>);
};

// Component Editor for creating/editing attribute components
const ComponentEditor: React.FC<{
	component: any;
	index: number;
	onUpdate: (updates: any) => void;
	onRemove: () => void;
}> = ({ component, index, onUpdate, onRemove }) => {
	const [optionInput, setOptionInput] = useState("");
	const [rangeInput, setRangeInput] = useState({ label: "", min: "", max: "", operator: "between" });

	const addOption = () => {
		if (!optionInput.trim()) return;
		
		const currentOptions = component.values.options || [];
		onUpdate({
			values: {
				...component.values,
				options: [...currentOptions, optionInput.trim()]
			}
		});
		setOptionInput("");
	};

	const removeOption = (optionIndex: number) => {
		const currentOptions = component.values.options || [];
		onUpdate({
			values: {
				...component.values,
				options: currentOptions.filter((_, i) => i !== optionIndex)
			}
		});
	};

	const addRange = () => {
		if (!rangeInput.label.trim()) return;

		const currentRanges = component.values.ranges || [];
		const newRange = {
			label: rangeInput.label,
			min: rangeInput.min ? parseInt(rangeInput.min) : null,
			max: rangeInput.max ? parseInt(rangeInput.max) : null,
			operator: rangeInput.operator
		};

		onUpdate({
			values: {
				...component.values,
				ranges: [...currentRanges, newRange]
			}
		});
		setRangeInput({ label: "", min: "", max: "", operator: "between" });
	};

	const removeRange = (rangeIndex: number) => {
		const currentRanges = component.values.ranges || [];
		onUpdate({
			values: {
				...component.values,
				ranges: currentRanges.filter((_, i) => i !== rangeIndex)
			}
		});
	};

	return (
		<div style={{
			border: "1px solid #e5e7eb",
			borderRadius: "8px",
			padding: "16px",
			backgroundColor: "#fafbfc",
		}}>
			<div style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "flex-start",
				marginBottom: "12px",
			}}>
				<div style={{ flex: 1, marginRight: "12px" }}>
					<div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
						<input
							type="text"
							value={component.label}
							onChange={(e) => onUpdate({ label: e.target.value })}
							placeholder="Component label (e.g., Small, Large, React)"
							style={{
								flex: 1,
								padding: "6px 8px",
								border: "1px solid #d1d5db",
								borderRadius: "4px",
								fontSize: "12px",
							}}
						/>
						<input
							type="color"
							value={component.color}
							onChange={(e) => onUpdate({ color: e.target.value })}
							style={{
								width: "40px",
								height: "32px",
								border: "1px solid #d1d5db",
								borderRadius: "4px",
								cursor: "pointer",
							}}
						/>
					</div>
					<span style={{
						fontSize: "11px",
						color: "#6b7280",
						backgroundColor: "#e5e7eb",
						padding: "2px 6px",
						borderRadius: "4px",
					}}>
						{component.inputType}
					</span>
				</div>
				<button
					onClick={onRemove}
					style={{
						background: "none",
						border: "1px solid #ef4444",
						color: "#ef4444",
						borderRadius: "4px",
						width: "24px",
						height: "24px",
						cursor: "pointer",
						fontSize: "12px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}>
					×
				</button>
			</div>

			{/* Text Configuration */}
			{component.inputType === "text" && (
				<div>
					<div style={{ marginBottom: "8px" }}>
						<label style={{
							fontSize: "11px",
							color: "#6b7280",
							marginBottom: "4px",
							display: "block",
						}}>
							Placeholder Text:
						</label>
						<input
							type="text"
							value={component.values.placeholder || ""}
							onChange={(e) => onUpdate({
								values: { ...component.values, placeholder: e.target.value }
							})}
							placeholder="Enter placeholder text..."
							style={{
								width: "100%",
								padding: "4px 8px",
								border: "1px solid #d1d5db",
								borderRadius: "4px",
								fontSize: "12px",
								boxSizing: "border-box",
							}}
						/>
					</div>
					<div style={{
						padding: "8px",
						backgroundColor: "#f3f4f6",
						borderRadius: "4px",
						border: "1px solid #d1d5db",
					}}>
						<div style={{
							fontSize: "11px",
							color: "#6b7280",
							marginBottom: "4px",
						}}>
							Preview:
						</div>
						<input
							type="text"
							placeholder={component.values.placeholder || "Enter text..."}
							disabled
							style={{
								width: "100%",
								padding: "4px 8px",
								border: "1px solid #d1d5db",
								borderRadius: "4px",
								fontSize: "12px",
								backgroundColor: "white",
								boxSizing: "border-box",
							}}
						/>
					</div>
				</div>
			)}

			{/* Options/Values Configuration */}
			{(component.inputType === "list" || component.inputType === "multiselect") && (
				<div>
					<div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
						<input
							type="text"
							value={optionInput}
							onChange={(e) => setOptionInput(e.target.value)}
							placeholder="Add option..."
							onKeyPress={(e) => e.key === "Enter" && addOption()}
							style={{
								flex: 1,
								padding: "4px 8px",
								border: "1px solid #d1d5db",
								borderRadius: "4px",
								fontSize: "12px",
							}}
						/>
						<button
							onClick={addOption}
							style={{
								backgroundColor: "#3b82f6",
								color: "white",
								border: "none",
								padding: "4px 8px",
								borderRadius: "4px",
								fontSize: "11px",
								cursor: "pointer",
							}}>
							Add
						</button>
					</div>
					<div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
						{(component.values.options || []).map((option: string, optIndex: number) => (
							<span
								key={optIndex}
								style={{
									backgroundColor: component.color,
									color: "white",
									fontSize: "11px",
									padding: "2px 6px",
									borderRadius: "12px",
									display: "flex",
									alignItems: "center",
									gap: "4px",
								}}>
								{option}
								<button
									onClick={() => removeOption(optIndex)}
									style={{
										background: "none",
										border: "none",
										color: "white",
										cursor: "pointer",
										fontSize: "10px",
										padding: 0,
										width: "12px",
										height: "12px",
										borderRadius: "50%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}>
									×
								</button>
							</span>
						))}
					</div>
				</div>
			)}

			{/* Range Configuration */}
			{component.inputType === "range" && (
				<div>
					<div style={{ display: "flex", gap: "4px", marginBottom: "8px", fontSize: "12px" }}>
						<input
							type="text"
							value={rangeInput.label}
							onChange={(e) => setRangeInput(prev => ({ ...prev, label: e.target.value }))}
							placeholder="Range label"
							style={{
								flex: 1,
								padding: "4px 6px",
								border: "1px solid #d1d5db",
								borderRadius: "4px",
							}}
						/>
						<select
							value={rangeInput.operator}
							onChange={(e) => setRangeInput(prev => ({ ...prev, operator: e.target.value }))}
							style={{
								padding: "4px 6px",
								border: "1px solid #d1d5db",
								borderRadius: "4px",
							}}>
							<option value="between">Between</option>
							<option value="gt">Greater than</option>
							<option value="lt">Less than</option>
							<option value="gte">Greater/Equal</option>
							<option value="lte">Less/Equal</option>
						</select>
						<input
							type="number"
							value={rangeInput.min}
							onChange={(e) => setRangeInput(prev => ({ ...prev, min: e.target.value }))}
							placeholder="Min"
							style={{
								width: "60px",
								padding: "4px 6px",
								border: "1px solid #d1d5db",
								borderRadius: "4px",
							}}
						/>
						{rangeInput.operator === "between" && (
							<input
								type="number"
								value={rangeInput.max}
								onChange={(e) => setRangeInput(prev => ({ ...prev, max: e.target.value }))}
								placeholder="Max"
								style={{
									width: "60px",
									padding: "4px 6px",
									border: "1px solid #d1d5db",
									borderRadius: "4px",
								}}
							/>
						)}
						<button
							onClick={addRange}
							style={{
								backgroundColor: "#f59e0b",
								color: "white",
								border: "none",
								padding: "4px 6px",
								borderRadius: "4px",
								fontSize: "11px",
								cursor: "pointer",
							}}>
							Add
						</button>
					</div>
					<div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
						{(component.values.ranges || []).map((range: any, rangeIndex: number) => (
							<span
								key={rangeIndex}
								style={{
									backgroundColor: component.color,
									color: "white",
									fontSize: "11px",
									padding: "2px 6px",
									borderRadius: "12px",
									display: "flex",
									alignItems: "center",
									gap: "4px",
								}}>
								{range.label} ({range.operator === "between" 
									? `${range.min}-${range.max}`
									: `${range.operator} ${range.min || range.max}`
								})
								<button
									onClick={() => removeRange(rangeIndex)}
									style={{
										background: "none",
										border: "none",
										color: "white",
										cursor: "pointer",
										fontSize: "10px",
										padding: 0,
										width: "12px",
										height: "12px",
										borderRadius: "50%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}>
									×
								</button>
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default SharedServiceDomainDrawer;
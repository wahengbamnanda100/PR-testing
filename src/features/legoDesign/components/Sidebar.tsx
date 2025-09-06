import React, { useState } from "react";
import { bianData } from "../data/configData";

interface SidebarProps {
	isCollapsed: boolean;
	onToggleCollapse: () => void;
	onServiceClick: (service: any, serviceIndex: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse, onServiceClick }) => {
	const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

	const toggleExpand = (uid: string) => {
		const newExpanded = new Set(expandedItems);
		if (newExpanded.has(uid)) {
			newExpanded.delete(uid);
		} else {
			newExpanded.add(uid);
		}
		setExpandedItems(newExpanded);
	};


	// Professional SVG-style icons for different levels
	const getIcon = (
		level: number,
		hasChildren: boolean,
		isExpanded: boolean
	) => {
		const iconStyle = {
			width: "16px",
			height: "16px",
			fill: level === 0 ? "#4f46e5" : level === 1 ? "#059669" : "#6b7280",
		};

		if (level === 0) {
			// Main category - Building/Organization icon
			return (
				<svg viewBox="0 0 24 24" style={iconStyle}>
					<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
				</svg>
			);
		} else if (level === 1) {
			// Business domain - Folder icon
			return hasChildren ? (
				isExpanded ? (
					<svg viewBox="0 0 24 24" style={iconStyle}>
						<path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
					</svg>
				) : (
					<svg viewBox="0 0 24 24" style={iconStyle}>
						<path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
					</svg>
				)
			) : (
				<svg viewBox="0 0 24 24" style={iconStyle}>
					<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
				</svg>
			);
		} else {
			// Service domain - Gear/Settings icon
			return (
				<svg viewBox="0 0 24 24" style={iconStyle}>
					<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
				</svg>
			);
		}
	};

	const renderTreeItem = (item: any, level: number = 0) => {
		const hasChildren = item.businessDomain && item.businessDomain.length > 0;
		const isExpanded = expandedItems.has(item.uid);
		const paddingLeft = level * 16 + 12;

		return (
			<div key={item.uid}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						padding: "8px 12px",
						paddingLeft: `${paddingLeft}px`,
						cursor: hasChildren ? "pointer" : "default",
						backgroundColor: "transparent",
						color: level === 0 ? "#111827" : "#374151",
						fontSize: level === 0 ? "14px" : "13px",
						fontWeight: level === 0 ? "600" : "500",
						transition: "all 0.15s ease",
						borderRadius: "8px",
						margin: "2px 8px",
						minHeight: "36px",
					}}
					onClick={() => hasChildren && toggleExpand(item.uid)}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor =
							level === 0 ? "#f3f4f6" : "#f9fafb";
						e.currentTarget.style.transform = "translateX(2px)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = "transparent";
						e.currentTarget.style.transform = "translateX(0px)";
					}}>
					{/* Prominent expand/collapse triangle */}
					{hasChildren && (
						<div
							style={{
								width: "24px",
								height: "24px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								marginRight: "4px",
								color: "#374151",
								backgroundColor: isExpanded ? "#e5e7eb" : "transparent",
								borderRadius: "4px",
								transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
								transition: "all 0.2s ease",
								cursor: "pointer",
							}}>
							<svg
								viewBox="0 0 24 24"
								style={{ width: "16px", height: "16px", fill: "currentColor" }}>
								<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
							</svg>
						</div>
					)}

					{!hasChildren && (
						<div style={{ width: "28px", marginRight: "4px" }} />
					)}

					{/* Icon */}
					<div
						style={{
							width: "18px",
							height: "18px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							marginRight: "8px",
						}}>
						{getIcon(level, hasChildren, isExpanded)}
					</div>

					{/* Text */}
					<span
						style={{
							flex: 1,
							lineHeight: "1.3",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
						title={item.name}>
						{item.name}
					</span>
				</div>

				{/* Nested content - Business Domains */}
				{hasChildren && isExpanded && (
					<div>
						{item.businessDomain.map((domain: any) => (
							<div key={domain.uid}>
								{/* Render Business Domain */}
								<div
									style={{
										display: "flex",
										alignItems: "center",
										padding: "8px 12px",
										paddingLeft: `${(level + 1) * 16 + 12}px`,
										cursor: domain.serviceDomain ? "pointer" : "default",
										backgroundColor: "transparent",
										color: "#374151",
										fontSize: "13px",
										fontWeight: "500",
										transition: "all 0.15s ease",
										borderRadius: "6px",
										margin: "2px 8px",
										minHeight: "32px",
									}}
									onClick={() =>
										domain.serviceDomain && toggleExpand(domain.uid)
									}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor = "#f9fafb";
										e.currentTarget.style.transform = "translateX(2px)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor = "transparent";
										e.currentTarget.style.transform = "translateX(0px)";
									}}>
									{/* Prominent triangle for business domain */}
									{domain.serviceDomain && domain.serviceDomain.length > 0 && (
										<div
											style={{
												width: "24px",
												height: "24px",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												marginRight: "4px",
												color: "#374151",
												backgroundColor: expandedItems.has(domain.uid)
													? "#e5e7eb"
													: "transparent",
												borderRadius: "4px",
												transform: expandedItems.has(domain.uid)
													? "rotate(90deg)"
													: "rotate(0deg)",
												transition: "all 0.2s ease",
												cursor: "pointer",
											}}>
											<svg
												viewBox="0 0 24 24"
												style={{
													width: "16px",
													height: "16px",
													fill: "currentColor",
												}}>
												<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
											</svg>
										</div>
									)}

									{(!domain.serviceDomain ||
										domain.serviceDomain.length === 0) && (
										<div style={{ width: "28px", marginRight: "4px" }} />
									)}

									{/* Business Domain Icon */}
									<div
										style={{
											width: "16px",
											height: "16px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											marginRight: "8px",
											fontSize: "12px",
										}}>
										{domain.serviceDomain && domain.serviceDomain.length > 0
											? expandedItems.has(domain.uid)
												? "📂"
												: "�"
											: "📋"}
									</div>

									{/* Business Domain Name */}
									<span
										style={{
											flex: 1,
											lineHeight: "1.3",
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
										title={domain.name}>
										{domain.name}
									</span>
								</div>

								{/* Service Domains - nested under Business Domain */}
								{domain.serviceDomain && expandedItems.has(domain.uid) && (
									<div>
										{domain.serviceDomain.map((service: any, serviceIndex: number) => (
											<div
												key={service.uid}
												style={{
													display: "flex",
													alignItems: "center",
													padding: "6px 12px",
													paddingLeft: `${(level + 2) * 16 + 12}px`,
													fontSize: "12px",
													color: "#6b7280",
													backgroundColor: "transparent",
													cursor: "pointer",
													transition: "all 0.15s ease",
													borderRadius: "6px",
													margin: "1px 8px",
													minHeight: "28px",
												}}
												onClick={() => onServiceClick(service, serviceIndex)}
												onMouseEnter={(e) => {
													e.currentTarget.style.backgroundColor = "#f3f4f6";
													e.currentTarget.style.color = "#374151";
													e.currentTarget.style.transform = "translateX(2px)";
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.backgroundColor = "transparent";
													e.currentTarget.style.color = "#6b7280";
													e.currentTarget.style.transform = "translateX(0px)";
												}}
												title={service.name}>
												{/* Spacing for alignment */}
												<div style={{ width: "28px", marginRight: "4px" }} />

												{/* Service icon */}
												<div
													style={{
														width: "18px",
														height: "18px",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														marginRight: "8px",
													}}>
													{getIcon(2, false, false)}
												</div>

												{/* Service name */}
												<span
													style={{
														flex: 1,
														lineHeight: "1.3",
														overflow: "hidden",
														textOverflow: "ellipsis",
														whiteSpace: "nowrap",
													}}>
													{service.name}
												</span>
											</div>
										))}
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		);
	};

	if (isCollapsed) {
		// Collapsed state - floating hamburger button
		return (
			<button
				onClick={onToggleCollapse}
				style={{
					position: "fixed",
					top: "20px",
					left: "20px",
					width: "48px",
					height: "48px",
					backgroundColor: "#4f46e5",
					border: "none",
					cursor: "pointer",
					borderRadius: "12px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					transition: "all 0.2s ease",
					boxShadow:
						"0 4px 12px rgba(79, 70, 229, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)",
					zIndex: 1001,
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.backgroundColor = "#4338ca";
					e.currentTarget.style.transform = "scale(1.05)";
					e.currentTarget.style.boxShadow =
						"0 6px 16px rgba(79, 70, 229, 0.4), 0 4px 8px rgba(0, 0, 0, 0.15)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.backgroundColor = "#4f46e5";
					e.currentTarget.style.transform = "scale(1)";
					e.currentTarget.style.boxShadow =
						"0 4px 12px rgba(79, 70, 229, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)";
				}}>
				<svg
					viewBox="0 0 24 24"
					style={{ width: "24px", height: "24px", fill: "white" }}>
					<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
				</svg>
			</button>
		);
	}

	// Expanded state - full sidebar
	return (
		<div
			style={{
				width: "320px",
				height: "100vh",
				backgroundColor: "#ffffff",
				borderRight: "1px solid #e5e7eb",
				overflow: "hidden",
				fontFamily:
					"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
				display: "flex",
				flexDirection: "column",
				boxShadow:
					"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
				transform: "translateX(0)",
				transition: "transform 0.3s ease-in-out",
			}}>
			{/* Professional Header */}
			<div
				style={{
					padding: "16px",
					backgroundColor: "#f9fafb",
					borderBottom: "1px solid #e5e7eb",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					minHeight: "64px",
				}}>
				<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
					<div
						style={{
							width: "32px",
							height: "32px",
							backgroundColor: "#4f46e5",
							borderRadius: "8px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "16px",
							color: "white",
							fontWeight: "700",
							boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
						}}>
						B
					</div>
					<div>
						<div
							style={{
								fontSize: "16px",
								fontWeight: "700",
								color: "#111827",
								lineHeight: "1.2",
								letterSpacing: "-0.025em",
							}}>
							BIAN Service domains
						</div>
						{/* <div
							style={{
								fontSize: "12px",
								color: "#6b7280",
								lineHeight: "1.2",
								fontWeight: "500",
							}}>
							Banking Architecture Network
						</div> */}
					</div>
				</div>

				{/* Highly visible collapse button */}
				<button
					onClick={onToggleCollapse}
					style={{
						width: "40px",
						height: "40px",
						backgroundColor: "#4f46e5",
						border: "none",
						cursor: "pointer",
						borderRadius: "8px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						transition: "all 0.2s ease",
						boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = "#4338ca";
						e.currentTarget.style.transform = "scale(1.1)";
						e.currentTarget.style.boxShadow =
							"0 4px 12px rgba(79, 70, 229, 0.4)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = "#4f46e5";
						e.currentTarget.style.transform = "scale(1)";
						e.currentTarget.style.boxShadow =
							"0 2px 8px rgba(79, 70, 229, 0.3)";
					}}>
					<div
						style={{
							width: "0",
							height: "0",
							borderTop: "8px solid transparent",
							borderBottom: "8px solid transparent",
							borderRight: "12px solid white",
							marginLeft: "2px",
						}}
					/>
				</button>
			</div>

			{/* Content Area */}
			<div
				style={{
					flex: 1,
					overflowY: "auto",
					overflowX: "hidden",
					backgroundColor: "#ffffff",
					padding: "12px 0",
				}}
				className="professional-scrollbar">
				{bianData.map((item) => renderTreeItem(item))}
			</div>

			{/* Professional scrollbar */}
			<style>{`
				.professional-scrollbar::-webkit-scrollbar {
					width: 8px;
				}
				.professional-scrollbar::-webkit-scrollbar-track {
					background: #f9fafb;
					border-radius: 4px;
				}
				.professional-scrollbar::-webkit-scrollbar-thumb {
					background: #d1d5db;
					border-radius: 4px;
					border: 2px solid #f9fafb;
				}
				.professional-scrollbar::-webkit-scrollbar-thumb:hover {
					background: #9ca3af;
				}
			`}</style>
		</div>
	);
};

export default Sidebar;

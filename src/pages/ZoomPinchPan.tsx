/* eslint-disable @typescript-eslint/no-explicit-any */
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AdjustIcon from "@mui/icons-material/Adjust";
import {
	Box,
	Button,
	useTheme,
	Typography,
	IconButton,
	Grid2 as Grid,
	Drawer,
} from "@mui/material";
import {
	Dispatch,
	SetStateAction,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import InfoOutlineIcon from "@mui/icons-material/InfoOutlined";

import {
	TransformWrapper,
	TransformComponent,
	useControls,
} from "react-zoom-pan-pinch";
import { removeSD } from "../store/slice/serviceDomainSlice";
import { SDSelector } from "../store/selector/serviceDomainSelector";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
// import { allocateChildrenInGrid } from "../utils/allocateChildren";
// import RenderChildren from "../components/ZoomPinchPan/RenderChildren";
import { LandscapeData } from "../utils/data";
import { FlatNode, flattenTree } from "../utils/flatenTree";
import { assignPositions } from "../utils/assignPosition";
const Controls = ({
	setScale,
	onReset,
}: {
	setScale: Dispatch<SetStateAction<number>>;
	onReset: () => void;
}) => {
	const { zoomIn, zoomOut, resetTransform, centerView } = useControls();

	const handleZoomIn = () => {
		zoomIn();
		setScale((prev) => prev + 1.2); // Approximate next zoom level
	};

	const handleZoomOut = () => {
		zoomOut();
		setScale((prev) => prev - 1.2);
	};

	const handleReset = () => {
		resetTransform();
		onReset();
		setScale(1); // Reset to default scale
	};

	const handleCenter = () => {
		centerView();
		// setScale(1); // Reset to default scale
	};

	return (
		<Box
			sx={{
				position: "absolute",
				bottom: 10,
				right: 10,
				display: "flex",
				flexDirection: "column",
				gap: 2,
				zIndex: 1000,
				padding: 1,
				borderRadius: 2,
				boxShadow: (theme) => theme.shadows[4],
				backgroundColor: (theme) => theme.palette.background.default,
			}}>
			<IconButton
				size="small"
				onClick={handleZoomIn}
				aria-label="zoom in"
				sx={{ width: 20, height: 20 }}>
				<AddIcon />
			</IconButton>
			<IconButton
				size="small"
				onClick={handleZoomOut}
				aria-label="zoom out"
				sx={{ width: 20, height: 20 }}>
				<RemoveIcon />
			</IconButton>
			<IconButton
				size="small"
				onClick={handleReset}
				aria-label="reset"
				sx={{ width: 20, height: 20 }}>
				<RestartAltIcon />
			</IconButton>
			<IconButton
				size="small"
				onClick={handleCenter}
				aria-label="reset"
				sx={{ width: 20, height: 20 }}>
				<AdjustIcon />
			</IconButton>
		</Box>
	);
};

const ZoomableCanvas = () => {
	const theme = useTheme();
	const rectRefs = useRef<any[]>([]);
	const transformRef = useRef<any>(null);
	const [scale, setScale] = useState(1);
	const [selectedIndex, setSelectedIndex] = useState<number | string | null>(
		null
	);

	const { flatNodes, positionMap } = useMemo(() => {
		const flat = flattenTree(LandscapeData);
		const pos = assignPositions(flat);
		return { flatNodes: flat, positionMap: pos };
	}, [LandscapeData]);

	const childVisibleThreshold = 2; // Show children when scale > 1.5
	const grandchildVisibleThreshold = 3;

	const getParentPath = (indexPath) => {
		if (!indexPath || typeof indexPath !== "string") return null;
		const lastDashIndex = indexPath.lastIndexOf("-");
		if (lastDashIndex > 0) {
			return indexPath.substring(0, lastDashIndex);
		}
		return null;
	};

	const parentsWithVisibleChildren = useMemo(() => {
		const parents = new Set();

		if (scale > childVisibleThreshold) {
			flatNodes.forEach((node) => {
				if (node.level === 1) {
					const lastDashIndex = node.indexPath.lastIndexOf("-");
					if (lastDashIndex > 0) {
						// Check if '-' exists and is not the first char
						const parentIndexPath = node.indexPath.substring(0, lastDashIndex);
						parents.add(parentIndexPath);
					} else {
						console.warn(
							`Could not reliably determine parent path for child: ${node.indexPath}. Add specific logic if needed.`
						);
					}
				}
			});
		}
		return parents;
	}, [flatNodes, scale, childVisibleThreshold]);

	const childrenWithVisibleGrandchildren = useMemo(() => {
		const children = new Set();
		if (scale > grandchildVisibleThreshold) {
			flatNodes.forEach((node) => {
				if (node.level === 2) {
					const parentPath = getParentPath(node.indexPath);
					if (parentPath) {
						children.add(parentPath);
					}
				}
			});
		}
		return children;
	}, [flatNodes, scale, grandchildVisibleThreshold]);

	// const handleBoxClick = (index: any, isChild = false) => {
	// 	if (transformRef.current && rectRefs.current[index]) {
	// 		const scale = isChild ? 6 : 3; // Increase zoom level for children
	// 		const transitionTime = 500;
	// 		setScale(scale);

	// 		transformRef.current.zoomToElement(
	// 			rectRefs.current[index],
	// 			scale,
	// 			transitionTime
	// 		);
	// 	}
	// };

	// const handleBoxClick = (index: any, isChild = false) => {
	// 	if (selectedIndex === index) return; // Prevent re-zooming if the same box is clicked again

	// 	if (transformRef.current && rectRefs.current[index]) {
	// 		const scale = isChild ? 6 : 3; // Increase zoom level for children
	// 		// const transitionTime = 500;
	// 		setScale(scale);
	// 		setSelectedIndex(index); // Store the selected index

	// 		// transformRef.current.zoomToElement(
	// 		// 	rectRefs.current[index],
	// 		// 	scale,
	// 		// 	transitionTime
	// 		// );
	// 	}
	// };

	const handleReset = () => {
		setSelectedIndex(null); // Reset the selected index
	};

	useEffect(() => {
		console.log({ scale });
	}, [scale]);

	return (
		<TransformWrapper
			initialScale={1}
			minScale={1}
			maxScale={50}
			doubleClick={{
				step: 0.7,
			}}
			smooth={true}
			onZoom={(zoom) => setScale(zoom.state.scale)}
			wheel={{
				step: 0.7,
				smoothStep: 0.005,
			}}
			pinch={{
				step: 5,
			}}
			ref={transformRef}>
			{({ ...props }) => {
				console.log({ props });

				return (
					<>
						<Controls setScale={setScale} onReset={handleReset} />;
						<TransformComponent
							contentStyle={{
								width: "100%",
								height: "100%",
							}}
							wrapperStyle={{
								width: "100%",
								height: "100%",
								// border: "1px solid blue",
							}}>
							<svg width="100%" height="100%" viewBox="0 0 840 400">
								{flatNodes.map((node) => {
									const pos = positionMap[node.indexPath];
									if (!pos) return null;
									const isParent = node.level === 0;
									const isChild = node.level === 1;
									const isGrandChild = node.level === 2;

									// --- Visibility rules for the NODE (rect + text container) ---
									const showParentNode = isParent; // Parent node container is always potentially visible
									const showChildNode =
										isChild && scale > childVisibleThreshold;
									const showGrandChildNode =
										isGrandChild && scale > grandchildVisibleThreshold;

									// Skip if not visible at this level
									if (!(showParentNode || showChildNode || showGrandChildNode))
										return null;

									// Assign colors based on level
									let fillColor;
									if (node.level === 0) fillColor = theme.palette.primary.main;
									else if (node.level === 1)
										fillColor = theme.palette.secondary.main;
									else fillColor = `hsl(${node.level * 10}, 70%, 60%)`;

									const getFontSizeForLevel = (level) => {
										// Base size that adapts to rect dimensions
										const widthBase =
											node.type === "bigArrow" ? pos.width - 70 : pos.width;
										const heightBase =
											node.type === "bigArrow" ? pos.height - 50 : pos.height;
										const baseSize = Math.min(widthBase, heightBase) * 0.3;
										if (level === 0) return `${baseSize - 20}px`;
										if (level === 1) return `${baseSize * 0.4}px`;
										return `${baseSize * 0.4}px`;
									};

									const fontSize = getFontSizeForLevel(node.level);
									// const textColor = getTextColor(fillColor);

									let showTextContent = true; // Default true
									if (
										isParent &&
										parentsWithVisibleChildren.has(node.indexPath)
									) {
										// Hide parent text if its children are visible
										showTextContent = false;
									} else if (
										isChild &&
										childrenWithVisibleGrandchildren.has(node.indexPath)
									) {
										// Hide child text if its children (grandchildren) are visible
										showTextContent = false;
									}
									return (
										<g key={node.indexPath}>
											{!node.type && (
												<rect
													x={pos.x}
													y={pos.y}
													width={pos.width}
													height={pos.height}
													fill={fillColor}
													// stroke="white"
													stroke={"white"}
													strokeWidth={0.5 / scale}
													// rx={2}
													// ry={2}
													rx={2 / scale}
													ry={2 / scale}
													ref={(el) => (rectRefs.current[node.indexPath] = el)}
													onClick={(e) => {
														e.stopPropagation();
														console.log("Clicked rect:", node.indexPath);
														// handleBoxClick(
														// 	node.indexPath,
														// 	isChild || isGrandChild
														// );
													}}
													style={{ cursor: "pointer" }}
												/>
											)}

											{node.type === "bigArrow" && (
												<ArrowShapeSVG
													x={pos.x}
													y={pos.y}
													width={pos.width}
													height={pos.height}
													ref={(el) => (rectRefs.current[node.indexPath] = el)}
													fill={theme.palette.primary.main}
													stroke="white"
													rx={2 / scale}
													ry={2 / scale}
													className="rect"
													onClick={(e) => {
														e.stopPropagation(); // Prevent parent click from triggering
														// handleBoxClick(index, false);
													}}
													strokeWidth={0.5 / scale}
													style={{ cursor: "pointer" }}
												/>
											)}

											{node.type === "arrow" && (
												<ArrowShapeSVG
													d={
														"M0.670959 0H278L298 123.5L278 255H0.670959L17.5 123.5L0.670959 0Z"
													}
													x={pos.x}
													y={pos.y}
													width={pos.width}
													height={pos.height}
													ref={(el) => (rectRefs.current[node.indexPath] = el)}
													fill={fillColor}
													rx={2 / scale}
													ry={2 / scale}
													originalHeight={255}
													originalWidth={298}
													stroke="white"
													// className="rect"
													onClick={(e) => {
														e.stopPropagation(); // Prevent parent click from triggering
														// handleBoxClick(index, false);
													}}
													// strokeWidth={2}
													style={{ cursor: "pointer" }}
												/>
											)}

											<foreignObject
												x={pos.x}
												y={pos.y}
												width={pos.width}
												height={pos.height}
												pointerEvents="none">
												{/* Required xmlns for HTML content */}
												<div
													xmlns="http://www.w3.org/1999/xhtml"
													style={{
														width: "100%",
														height: "100%",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														fontSize: fontSize,
														color: "white",
														textAlign: "center",
														overflow: "hidden",
														wordBreak: "break-word",
														padding: "2px", // Add slight padding
														boxSizing: "border-box",
														pointerEvents: "none",
														opacity: showTextContent ? 1 : 0,
														transition: "opacity 0.2s ease-in-out",
														// Optional: Improve text rendering quality
														fontFamily: "sans-serif", // Explicitly set a font
													}}>
													{node.label}
												</div>
											</foreignObject>
										</g>
									);
								})}
							</svg>
						</TransformComponent>
					</>
				);
			}}
		</TransformWrapper>
	);
};
const ZoomPanPinch = () => {
	const serviceDomain = useSelector(SDSelector);
	const isSDSelected = serviceDomain === null ? false : true;

	console.log("isSD selcted", isSDSelected, serviceDomain);
	return (
		<Grid container spacing={0.5} sx={{ height: "100vh", width: "100vw" }}>
			{isSDSelected && (
				<LeftDrawer open={isSDSelected}>
					<LeftSideComponent title={serviceDomain} />
				</LeftDrawer>
			)}

			<Grid size={{ xs: 12 }}>
				<Box
					sx={{
						width: "100%",
						height: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						position: "relative",
						// border: "1px solid red",
						bgcolor: (theme) => theme.palette.grey[200],
					}}>
					<ZoomableCanvas />
				</Box>
			</Grid>
		</Grid>
	);
};

export default ZoomPanPinch;

export const ParentText = ({ rect, scale }: any) => {
	if (scale > 1.5) {
		if (rect.children.length > 0) {
			return (
				<text
					x={rect.x + 5}
					y={rect.y + 1}
					textAnchor="start"
					alignmentBaseline="hanging"
					fill="white"
					fontSize="8"
					fontWeight="medium">
					{rect.label}
				</text>
			);
		}
	}
	return (
		<text
			x={rect.x + rect.width / 2}
			y={rect.y + rect.height / 2}
			textAnchor="middle"
			alignmentBaseline="middle"
			fill="white"
			fontSize="16"
			fontWeight="bold">
			{rect.label}
		</text>
	);
};

export const NestedParentText = ({
	rect,
	scale,
	parentScale,
	childrenScale,
	fontSize = "8",
	childFontSize = "2",
}: any) => {
	const { x, y, width, height, label, children = [] } = rect;

	const hasChildren = children.length > 0;

	if (scale >= childrenScale && hasChildren) {
		// Label shown for child view
		return (
			<text
				x={x + 15}
				y={y + 6}
				textAnchor="start"
				alignmentBaseline="hanging"
				fill="white"
				fontSize={childFontSize}
				fontWeight="500">
				{label}
			</text>
		);
	}

	if (scale >= parentScale) {
		// Label shown for parent view
		return (
			<text
				x={x + width / 2}
				y={y + height / 2}
				textAnchor="middle"
				alignmentBaseline="middle"
				fill="white"
				fontSize={fontSize}
				fontWeight="bold">
				{label}
			</text>
		);
	}

	return null;
};

export const ArrowShapeSVG = ({
	x,
	y,
	width,
	height,
	ref,
	onClick,
	className,
	fill = "blue",
	stroke = "white",
	strokeWidth = 2,
	originalWidth = 342,
	originalHeight = 426,
	d = "M0 0H276L342 223.785L276 426H0L59.5 223.785L0 0Z",
}: any) => {
	const scaleX = width / originalWidth;
	const scaleY = height / originalHeight;
	return (
		<path
			d={d}
			transform={`translate(${x}, ${y}) scale(${scaleX}, ${scaleY})`}
			width={width}
			height={height}
			ref={ref}
			className={className}
			fill={fill}
			rx={2}
			ry={2}
			stroke={stroke}
			strokeWidth={strokeWidth}
			onClick={onClick}
		/>
	);
};

export const ShapeSVG = ({
	x,
	y,
	width,
	height,
	label,
	ref,
	onClick,
	className,
	fill = "blue",
	stroke = "white",
	strokeWidth = 2,
	fontSize = "8",
	fontWeight = "bold",
	grandchild = false,
	onInfoClick,
}: any) => {
	return (
		<>
			<rect
				x={x}
				y={y}
				width={width}
				height={height}
				ref={ref}
				className={className}
				fill={fill}
				rx={grandchild ? 0.5 : 2}
				ry={grandchild ? 0.5 : 2}
				stroke={stroke}
				strokeWidth={strokeWidth}
				onClick={onClick}
			/>

			{grandchild && (
				<foreignObject
					x={x}
					y={y + height / 2 - 8} // center vertically
					width={width}
					height={16}>
					<div
						xmlns="http://www.w3.org/1999/xhtml"
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "100%",
							gap: 1,
							padding: 0.5,
							color: "white",
							fontSize: `${fontSize}px`, // ensure consistency with SVG
							fontWeight: fontWeight,
							fontFamily: "sans-serif",
							pointerEvents: "none",
						}}>
						<span style={{ pointerEvents: "auto" }}>{label}</span>
						<IconButton
							onClick={onInfoClick}
							style={{
								padding: 0,
								width: 4,
								height: 4,
								color: "white",
								backgroundColor: "transparent",
								pointerEvents: "auto",
							}}>
							<InfoOutlineIcon sx={{ fontSize: 3 }} />
						</IconButton>
					</div>
				</foreignObject>
			)}
		</>
	);
};

export const LeftSideComponent = ({ title }: any) => {
	const dispatch = useDispatch();

	return (
		<Box
			sx={{
				position: "relative",
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				bgcolor: (theme) => theme.palette.grey[200],
			}}>
			<IconButton
				aria-label="close"
				sx={{
					position: "absolute",
					top: 1,
					// left: 0,
					right: 1,
					m: 1,
					color: "black",
				}}
				onClick={() => dispatch(removeSD())}>
				<CloseIcon />
			</IconButton>
			<Typography variant="h5" color="primary" sx={{ p: 2 }}>
				{title}
			</Typography>
		</Box>
	);
};

export const MIN_WIDTH = 240;
export const MAX_WIDTH = 600;
// const MotionBox = motion(Box);
export const drawerVariants = {
	hidden: (width: number) => ({ x: -width }),
	visible: { x: 0 },
	exit: (width: number) => ({ x: -width }),
};

export const LeftDrawer = ({
	open,
	children,
}: {
	open: boolean;
	children: React.ReactNode;
}) => {
	const [drawerWidth, setDrawerWidth] = useState(320);

	return (
		<AnimatePresence>
			{open && (
				<Box
					component={motion.div}
					key="left-drawer"
					variants={drawerVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					custom={drawerWidth}
					transition={{ duration: 0.3 }}
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						height: "100vh",
						zIndex: 1200,
						display: "flex",
					}}>
					<ResizableBox
						width={drawerWidth}
						height={Infinity}
						axis="x"
						resizeHandles={["e"]}
						minConstraints={[MIN_WIDTH, Infinity]}
						maxConstraints={[MAX_WIDTH, Infinity]}
						onResizeStop={(e, data) => setDrawerWidth(data.size.width)}
						handle={
							<span
								className="custom-handle custom-handle-e"
								style={{
									position: "absolute",
									right: 0,
									top: 0,
									height: "100%",
									width: "6px",
									cursor: "ew-resize",
									backgroundColor: "#444",
									zIndex: 1300,
								}}
							/>
						}>
						<Box
							sx={{
								height: "100vh",
								width: "100%",
							}}>
							<Drawer
								variant="persistent"
								anchor="left"
								open={open}
								slotProps={{
									paper: {
										sx: {
											width: "100%",
											height: "100vh",
											bgcolor: "#1b1b1b",
											color: "white",
											// p: 2,
											position: "relative",
										},
									},
								}}>
								{children}
							</Drawer>
						</Box>
					</ResizableBox>
				</Box>
			)}
		</AnimatePresence>
	);
};

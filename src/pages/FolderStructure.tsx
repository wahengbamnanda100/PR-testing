/* eslint-disable @typescript-eslint/no-explicit-any */
// ExplorerTree.tsx
import React, {
	useRef,
	useEffect,
	useState,
	useMemo,
	useCallback,
} from "react"; // Ensure all hooks are imported
import {
	List,
	ListItemButton,
	ListItemText,
	Collapse,
	Box,
	ListItemIcon,
	Divider,
	CircularProgress,
	ListItem,
} from "@mui/material";
import {
	ExpandLess,
	ExpandMore,
	Folder as FolderIcon,
	MiscellaneousServices as ServiceDomainIcon,
	Tune as BehaviourQualifierIcon, // Icon for Behaviour Qualifier
	Assessment as BusinessScenarioIcon, // Icon for Business Scenario
	Policy as ControlRecordIcon, // Icon for Control Record
	SettingsApplications as ServiceOperationIcon, // Icon for Service Operation
} from "@mui/icons-material";
import {
	Panel,
	PanelGroup,
	PanelResizeHandle,
	ImperativePanelHandle, // Import this type
} from "react-resizable-panels";
import { initialTreeData } from "../utils/data"; // Assuming this path is correct
import OverviewPanel from "./Folder/OverviewPanel"; // Make sure this path is correct (e.g., if ExplorerTree.tsx is in src/)
import useServiceDomainLiteDetails from "./Folder/hook/useServideDomainLite";
// import useServiceDomainDetails from "./Folder/hook/useServiceDomainDetails";

// --- TYPE DEFINITIONS (can be in a separate types.ts file) ---
interface RawServiceDomainNode {
	uid: string;
	name: string;
}
interface RawBusinessDomainNode {
	uid: string;
	name: string;
	serviceDomain: RawServiceDomainNode[];
}
interface RawRootNode {
	uid: string;
	name: string;
	businessDomain: RawBusinessDomainNode[];
}

// interface RawBQNode {
// 	bianId: string;
// 	name: string;
// 	type: string; // "BQ"
// 	boType: string;
// 	dataType: string;
// 	description: string;
// 	attributes: RawBQNode[] | null; // Recursive
// 	// Add other properties from your BQ data structure if needed
// }

// From image: ControlRecord.attributes
interface RawAttribute {
	type: string | null;
	boType: string | null;
	dataType: string | null;
	dataTypeBianId: string | null;
	direction: string | null;
	parentObjectName: string | null;
	name: string | null;
	description: string | null;
}

// From image: ControlRecord
export interface RawControlRecordNode {
	uid: string;
	name: string | null;
	description: string | null;
	bianId: string | null;
	serviceDomainID: number;
	serviceDomainName: string | null;
	attributes: RawAttribute[] | null;
}

// From image: BusinessScenario
export interface RawBusinessScenarioNode {
	id: number;
	uid: string;
	bianId: string | null;
	name: string | null;
	displayName: string;
	description: string | null;
	status: string | null;
}

// Using the previously defined RawBQNode structure for Behaviour Qualifiers
export interface RawBehaviourQualifierNode {
	uid: string; // Assuming BIAN ID or a generated UID
	name: string;
	type?: string; // e.g., "BQ"
	boType?: string;
	dataType?: string;
	description?: string;
}

export interface RawServiceOperationNode {
	uid: string;
	name: string;
	description?: string;
}

export interface RawServiceDomainDetails {
	controlRecords: RawControlRecordNode[];
	businessScenarios: RawBusinessScenarioNode[];
	behaviourQualifiers: RawBehaviourQualifierNode[];
	serviceOperations: RawServiceOperationNode[];
}

export interface ProcessedNode {
	uid: string;
	name: string;
	type:
		| "root"
		| "businessDomain"
		| "serviceDomain"
		| "controlRecord"
		| "businessScenario"
		| "behaviourQualifier"
		| "serviceOperation";
	children?: ProcessedNode[];
	isFetched?: boolean;
	isLoading?: boolean;
	rawData?: any;
}

// const mockServiceDomainDetails: Record<string, RawServiceDomainDetails> = {
// 	sd1_uid: {
// 		// Assuming a service domain with uid "sd1_uid"
// 		behaviourQualifiers: [
// 			{
// 				uid: "sd1_bq1",
// 				name: "BQ Alpha for SD1",
// 				description: "Details for BQ Alpha",
// 			},
// 			{ uid: "sd1_bq2", name: "BQ Beta for SD1", boType: "Customer" },
// 		],
// 		businessScenarios: [
// 			{
// 				id: 101,
// 				uid: "sd1_bs1",
// 				displayName: "BS Gamma Scenario (SD1)",
// 				name: "BS Gamma",
// 				description: "Scenario Gamma for SD1",
// 				bianId: "BIAN_BS_G",
// 				status: "Active",
// 			},
// 		],
// 		controlRecords: [
// 			{
// 				uid: "sd1_cr1",
// 				name: "CR Delta Record (SD1)",
// 				description: "Control Record Delta",
// 				serviceDomainID: 1,
// 				serviceDomainName: "Service Domain 1",
// 				bianId: "BIAN_CR_D",
// 				attributes: [],
// 			},
// 		],
// 		serviceOperations: [
// 			{
// 				uid: "sd1_so1",
// 				name: "SO Epsilon Operation (SD1)",
// 				description: "Service Operation Epsilon",
// 			},
// 			{ uid: "sd1_so2", name: "SO Zeta Operation (SD1)" },
// 		],
// 	},
// 	sd2_uid: {
// 		// Another example
// 		behaviourQualifiers: [{ uid: "sd2_bq1", name: "BQ X for SD2" }],
// 		businessScenarios: [],
// 		controlRecords: [
// 			{
// 				uid: "sd2_cr1",
// 				name: "CR Y for SD2",
// 				serviceDomainID: 2,
// 				serviceDomainName: "Service Domain 2",
// 				bianId: "BIAN_CR_Y",
// 				attributes: null,
// 				description: null,
// 			},
// 		],
// 		serviceOperations: [],
// 	},
// };

// const fetchServiceDomainDetailsMock = (
// 	serviceDomainUid: string
// ): Promise<RawServiceDomainDetails> => {
// 	console.log(`Fetching details for Service Domain: ${serviceDomainUid}`);
// 	return new Promise((resolve, reject) => {
// 		setTimeout(() => {
// 			const details = mockServiceDomainDetails[serviceDomainUid];
// 			if (details) {
// 				resolve(details);
// 			} else {
// 				// Resolve with empty arrays if no specific mock data, to simulate an empty response
// 				resolve({
// 					behaviourQualifiers: [],
// 					businessScenarios: [],
// 					controlRecords: [],
// 					serviceOperations: [],
// 				});
// 			}
// 		}, 1000); // Simulate network delay
// 	});
// };

// --- DATA PROCESSING FUNCTION ---
function transformAndAssignTypes(rawData: RawRootNode[]): ProcessedNode[] {
	const transformServiceDomains = (
		sDomains: RawServiceDomainNode[]
	): ProcessedNode[] => {
		return sDomains.map((sdNode) => ({
			uid: sdNode.uid,
			name: sdNode.name,
			type: "serviceDomain",
			isFetched: false, // Initially, children are not fetched
			isLoading: false,
			rawData: sdNode,
			// children: [
			// 	{
			// 		uid: `${sdNode.uid}-controlRecord`,
			// 		type: "controlRecord",
			// 		name: "Control Records",
			// 	},
			// 	{
			// 		uid: `${sdNode.uid}-businessScenario`,
			// 		type: "businessScenario",
			// 		name: "Business Scenarios",
			// 	},
			// 	{
			// 		uid: `${sdNode.uid}-behaviourQualifier`,
			// 		type: "behaviourQualifier",
			// 		name: "Behaviour Qualifiers",
			// 	},
			// 	{
			// 		uid: `${sdNode.uid}-serviceOperation`,
			// 		type: "serviceOperation",
			// 		name: "Service Operations",
			// 	},
			// ],
		}));
	};

	const transformBusinessDomains = (
		bDomains: RawBusinessDomainNode[]
	): ProcessedNode[] => {
		return bDomains.map((bdNode) => ({
			uid: bdNode.uid,
			name: bdNode.name,
			type: "businessDomain",
			children: transformServiceDomains(bdNode.serviceDomain),
			rawData: bdNode,
		}));
	};

	return rawData.map((rootNode) => ({
		uid: rootNode.uid,
		name: rootNode.name,
		type: "root",
		children: transformBusinessDomains(rootNode.businessDomain),
		rawData: rootNode,
	}));
}

function updateNodeInTree(
	nodes: ProcessedNode[],
	targetUid: string,
	updates: Partial<ProcessedNode>
): ProcessedNode[] {
	return nodes.map((node) => {
		if (node.uid === targetUid) {
			console.log(
				"targetUid => ",
				targetUid,
				"updates => ",
				updates,
				"nodes => ",
				node
			);
			return { ...node, ...updates };
		}
		if (node.children) {
			const updatedChildren = updateNodeInTree(
				node.children,
				targetUid,
				updates
			);
			if (updatedChildren !== node.children) {
				return { ...node, children: updatedChildren };
			}
		}
		return node;
	});
}

function updateNodeChildren(
	nodes: ProcessedNode[],
	targetUid: string,
	newChildren: ProcessedNode[]
): ProcessedNode[] {
	return nodes.map((node) => {
		// Base case: We found the target node.
		if (node.uid === targetUid) {
			// Return a new node object with the updated children and flags.
			return {
				...node,
				children: newChildren,
				isFetched: true,
				isLoading: false,
			};
		}

		// Recursive step: If the node has children, search within them.
		if (node.children) {
			const updatedChildren = updateNodeChildren(
				node.children,
				targetUid,
				newChildren
			);

			// If the recursive call returned a new array, it means an update occurred.
			// We must return a new parent node to contain the updated children array.
			if (updatedChildren !== node.children) {
				return { ...node, children: updatedChildren };
			}
		}

		// If this isn't the target and no updates happened in its children, return the original node.
		return node;
	});
}

// --- Helper function to update nodes recursively ---
// function updateNodeInTree(
// 	nodes: ProcessedNode[],
// 	targetUid: string,
// 	updates: Partial<Omit<ProcessedNode, "children" | "rawData">> & {
// 		children?: ProcessedNode[];
// 		rawData?: any;
// 	}
// ): ProcessedNode[] {
// 	return nodes.map((node) => {
// 		if (node.uid === targetUid) {
// 			const newChildren =
// 				updates.children !== undefined ? updates.children : node.children;
// 			const { children, ...restOfUpdates } = updates;
// 			return { ...node, ...restOfUpdates, children: newChildren };
// 		}
// 		if (node.children && node.children.length > 0) {
// 			const updatedChildren = updateNodeInTree(
// 				node.children,
// 				targetUid,
// 				updates
// 			);
// 			if (updatedChildren !== node.children) {
// 				return { ...node, children: updatedChildren };
// 			}
// 		}
// 		return node;
// 	});
// }

// --- COMPONENTS ---
interface TreeItemProps {
	node: ProcessedNode;
	level?: number;
	onSelectNode: (node: ProcessedNode) => void;
	selectedUid: string | null;
	onToggleExpand: (node: ProcessedNode, isOpening: boolean) => void;
}

const TreeItem: React.FC<TreeItemProps> = ({
	node,
	level = 0,
	onSelectNode,
	selectedUid,
	onToggleExpand,
}) => {
	const [open, setOpen] = React.useState(false);
	const nestedChildren: ProcessedNode[] = node.children || [];
	const isPotentiallyExpandable =
		node.type === "serviceDomain" || nestedChildren.length > 0;
	const isSelected = node.uid === selectedUid;

	const handleToggle = (event: React.MouseEvent) => {
		event.stopPropagation();
		const newOpenState = !open;
		setOpen(newOpenState);
		// If it's a service domain and we are opening it for the first time (not fetched yet)

		console.log("✅✅ Toggling node:", node, "to", newOpenState);
		if (
			node.type === "serviceDomain" &&
			newOpenState &&
			!node.isFetched &&
			!node.isLoading
		) {
			onToggleExpand(node, newOpenState);
		} else if (isPotentiallyExpandable) {
			onToggleExpand(node, newOpenState); // For other cases or already fetched SDs
		}
	};

	const handleSelect = () => {
		onSelectNode(node);
	};

	// useEffect(() => {
	// 	console.log({ node });
	// }, [node]);

	let itemIcon;
	if (node.type === "serviceDomain")
		itemIcon = <ServiceDomainIcon fontSize="small" />;
	else if (node.type === "controlRecord")
		itemIcon = <ControlRecordIcon fontSize="small" />;
	else if (node.type === "businessScenario")
		itemIcon = <BusinessScenarioIcon fontSize="small" />;
	else if (node.type === "behaviourQualifier")
		itemIcon = <BehaviourQualifierIcon fontSize="small" />;
	else if (node.type === "serviceOperation")
		itemIcon = <ServiceOperationIcon fontSize="small" />;
	else if (isPotentiallyExpandable)
		itemIcon = <FolderIcon fontSize="small" />; // For root, businessDomain
	else itemIcon = <Box sx={{ width: 20 }} />; // Placeholder for non-expandable, non-specific items

	return (
		<>
			<ListItemButton
				onClick={handleSelect}
				selected={isSelected}
				sx={{ pl: level * 2 + 1, py: 0.5, height: "32px" }}>
				<ListItemIcon
					sx={{
						minWidth: "auto",
						mr: 0.5,
						display: "flex",
						alignItems: "center",
						width: 20, // Ensure consistent width for expand icon area
					}}>
					{node.type === "serviceDomain" && node.isLoading ? (
						<CircularProgress size={16} thickness={5} />
					) : isPotentiallyExpandable ? (
						open ? (
							<ExpandLess fontSize="small" onClick={handleToggle} />
						) : (
							<ExpandMore fontSize="small" onClick={handleToggle} />
						)
					) : (
						<Box sx={{ width: 20 }} /> // Placeholder for non-expandable items
					)}
				</ListItemIcon>
				<ListItemIcon
					sx={{
						minWidth: "auto",
						mr: 1,
						display: "flex",
						alignItems: "center",
					}}>
					{itemIcon}
				</ListItemIcon>
				<ListItemText
					primary={node.name}
					primaryTypographyProps={{
						variant: "body2",
						noWrap: true,
						fontSize: "0.875rem",
					}}
				/>
			</ListItemButton>
			<Divider component="li" sx={{ ml: level * 2 + 1 }} />

			{isPotentiallyExpandable && (
				<Collapse in={open} timeout="auto" unmountOnExit>
					{/* <List component="div" disablePadding dense>
						{nestedChildren.map((child) => (
							<TreeItem
								key={child.uid}
								node={child}
								level={level + 1}
								onSelectNode={onSelectNode}
								selectedUid={selectedUid}
								onToggleExpand={onToggleExpand}
							/>
						))}
					</List> */}
					{node.isLoading ? (
						// State 1: Show a spinner while loading
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								py: 2,
							}}>
							<CircularProgress size={24} />
						</Box>
					) : nestedChildren.length > 0 ? (
						// State 2: Show the children list if they exist
						<List component="div" disablePadding dense>
							{nestedChildren.map((child) => (
								<TreeItem
									key={child.uid}
									node={child}
									level={level + 1}
									onSelectNode={onSelectNode}
									selectedUid={selectedUid}
									onToggleExpand={onToggleExpand}
								/>
							))}
						</List>
					) : node.isFetched ? (
						// State 3 (Optional but good UX): Show an empty message if fetch is done but no children were found
						<ListItem sx={{ pl: (level + 1) * 2 + 1 }}>
							<ListItemText
								primary="No items found"
								primaryTypographyProps={{
									variant: "caption",
									fontStyle: "italic",
									color: "text.secondary",
								}}
							/>
						</ListItem>
					) : null}
				</Collapse>
			)}
		</>
	);
};

interface ExplorerTreeProps {
	data: ProcessedNode[];
	onSelectNode: (node: ProcessedNode) => void;
	selectedUid: string | null;
	onToggleServiceDomainExpand: (
		node: ProcessedNode,
		isOpening: boolean
	) => void;
}

const ExplorerTree: React.FC<ExplorerTreeProps> = ({
	data,
	onSelectNode,
	selectedUid,
	onToggleServiceDomainExpand,
}) => {
	return (
		<Box sx={{ height: "100%", overflowY: "auto", width: "100%" }}>
			<List component="nav" dense sx={{ p: 0 }}>
				{data.map((node) => (
					<TreeItem
						key={node.uid}
						node={node}
						onSelectNode={onSelectNode}
						selectedUid={selectedUid}
						level={0}
						onToggleExpand={onToggleServiceDomainExpand}
					/>
				))}
			</List>
		</Box>
	);
};

const DEFAULT_DETAILS_PANEL_SIZE = 65;
const DEFAULT_EXPLORER_PANEL_SIZE = 100 - DEFAULT_DETAILS_PANEL_SIZE;

const FolderView = () => {
	const initialProcessedData = useMemo(
		() => transformAndAssignTypes(initialTreeData),
		[]
	);
	const [treeData, setTreeData] =
		useState<ProcessedNode[]>(initialProcessedData);
	const [selectedNode, setSelectedNode] = useState<ProcessedNode | null>(null);
	const [dropDownNode, setDropDownNode] = useState<ProcessedNode | null>(null);
	const [isOverviewVisible, setIsOverviewVisible] = useState(false);

	const explorerPanelRef = useRef<ImperativePanelHandle>(null);
	const detailsPanelRef = useRef<ImperativePanelHandle>(null);

	// const [serviceDomainUID, setSDUid] = useState<>(null);

	const serviceDomainUID =
		dropDownNode?.type === "serviceDomain" ? dropDownNode.uid : null;

	const {
		data: details,
		loading,
		error,
	} = useServiceDomainLiteDetails(serviceDomainUID);

	const handleToggleServiceDomainExpand = useCallback(
		async (node: ProcessedNode, isOpening: boolean) => {
			console.log("Fetching details for service domain:", node);
			setDropDownNode(node);
		},
		[]
	); // No dependencies that change often, safe for useCallback

	const handleSelectNode = (node: ProcessedNode) => {
		setSelectedNode(node);
		const showOverviewForTypes: ProcessedNode["type"][] = [
			"serviceDomain",
			"behaviourQualifier",
			"businessScenario",
			"controlRecord",
			"serviceOperation",
		];
		if (showOverviewForTypes.includes(node.type)) {
			setIsOverviewVisible(true);
		} else {
			setIsOverviewVisible(false);
		}
	};

	useEffect(() => {
		console.log("FolderView mounted or updated with details:", {
			details,
			loading,
			error,
		});
		if (loading) {
			setTreeData((currentTree) =>
				updateNodeInTree(currentTree, serviceDomainUID!, { isLoading: true })
			);
		}

		try {
			const controlRecord = details && details.controlRecord;
			// const serviceOperation = details && details.serviceOperations;
			// const businessScenario = details && details.businessScenarios;
			// const behaviourQualifiers = details && details.behaviourQualifiers
			const rawChildData: any[] = [
				{
					uid: `${controlRecord!.uid}-controlRecord`,
					type: "controlRecord",
					name: controlRecord.name,
				},
				{
					uid: `${details!.uid}-businessScenarios`,
					type: "businessScenario",
					name: "Business Scenarios",
				},
				{
					uid: `${details!.uid}-behaviourQualifier`,
					type: "behaviourQualifier",
					name: "Behaviour Qualifier",
				},
				{
					uid: `${details!.bianId}-serviceOperation`,
					type: "serviceOperation",
					name: "Service Operation",
				},
			];

			// 3. Transform the raw API data into ProcessedNode[] format
			// (You might need a small helper for this)
			const newChildren: ProcessedNode[] = rawChildData.map((child) => ({
				uid: child.uid,
				name: child.name,
				type: child.type,
				rawData: child,
			}));

			// 4. Update the state using the 'updateNodeChildren' helper
			// We use the functional form of setState to ensure we have the latest state.
			setTreeData((currentTree) =>
				updateNodeChildren(currentTree, serviceDomainUID!, newChildren)
			);
		} catch (error) {
			console.error(
				"Failed to fetch children for node:",
				serviceDomainUID!,
				error
			);
			// On error, reset the loading state
			setTreeData((currentTree) =>
				updateNodeInTree(currentTree, serviceDomainUID!, { isLoading: false })
			);
		}
	}, [details, loading, error]); // This effect can be used to handle side effects based on details loading state

	useEffect(() => {
		const detailPanel = detailsPanelRef.current;
		const explorerPanel = explorerPanelRef.current;

		if (detailPanel && explorerPanel) {
			if (isOverviewVisible) {
				explorerPanel.resize(DEFAULT_EXPLORER_PANEL_SIZE);
				detailPanel.resize(DEFAULT_DETAILS_PANEL_SIZE);
			} else {
				if (!detailPanel.isCollapsed()) {
					detailPanel.collapse();
				}
				if (explorerPanel.getSize() < 100) {
					explorerPanel.resize(100);
				}
			}
		}
	}, [isOverviewVisible, selectedNode]); // Removed selectedNode from deps to prevent snapback on every selection if user manually resized. Add back if snapback is desired.

	return (
		<Box
			sx={{
				height: "100vh",
				width: "100vw",
				display: "flex",
				bgcolor: "white",
				color: "black",
			}}>
			<PanelGroup direction="horizontal">
				<Panel
					ref={explorerPanelRef}
					defaultSize={100}
					minSize={20}
					collapsible={false}
					order={0}>
					<ExplorerTree
						data={treeData}
						onSelectNode={handleSelectNode}
						selectedUid={selectedNode?.uid || null}
						onToggleServiceDomainExpand={handleToggleServiceDomainExpand}
					/>
				</Panel>
				<PanelResizeHandle
					className="ResizeHandleOuter"
					style={{ display: isOverviewVisible ? "flex" : "none" }}>
					<div className="ResizeHandleInner" />
				</PanelResizeHandle>
				<Panel
					ref={detailsPanelRef}
					defaultSize={0}
					collapsible={true}
					collapsedSize={0}
					minSize={isOverviewVisible ? 30 : 0}
					order={1}>
					<OverviewPanel
						selectedItem={isOverviewVisible ? selectedNode : null}
					/>
				</Panel>
			</PanelGroup>
		</Box>
	);
};

export default FolderView;

// src/components/ExplorerTree.tsx
import React, {
	useRef,
	useEffect,
	useState,
	useMemo,
	useCallback,
} from "react";
import {
	List,
	ListItemButton,
	ListItemText,
	Collapse,
	Box,
	ListItemIcon,
	Divider,
	CircularProgress,
} from "@mui/material";
import {
	ExpandLess,
	ExpandMore,
	Folder as FolderIcon,
	MiscellaneousServices as ServiceDomainIcon,
	Tune as BehaviourQualifierIcon,
	Assessment as BusinessScenarioIcon,
	Policy as ControlRecordIcon,
	SettingsApplications as ServiceOperationIcon,
} from "@mui/icons-material";
import {
	Panel,
	PanelGroup,
	PanelResizeHandle,
	ImperativePanelHandle,
} from "react-resizable-panels";
import { initialTreeData } from "../utils/data";
// Ensure OverviewPanel is imported from the correct relative path if ExplorerTree.tsx is in src/components/
import OverviewPanel from "./Folder/OverviewPanel"; // Path in the original code
import {
	fetchServiceDomainDetailsFromApi,
	RawServiceDomainDetails,
} from "../api/serviceDomainApi"; // Import the shared API call

// --- TYPE DEFINITIONS ---
// Keep these types here or move to a shared types file (e.g., src/types.ts)
// and import them in serviceDomainApi.ts as well. For this example, I'll keep them here
// and assume serviceDomainApi.ts imports them appropriately.

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

export interface RawAttribute {
	// Export if used by other files directly
	type: string | null;
	boType: string | null;
	dataType: string | null;
	dataTypeBianId: string | null;
	direction: string | null;
	parentObjectName: string | null;
	name: string | null;
	description: string | null;
}

export interface RawControlRecordNode {
	// Export if used by other files directly
	uid: string;
	name: string | null;
	description: string | null;
	bianId: string | null;
	serviceDomainID: number;
	serviceDomainName: string | null;
	attributes: RawAttribute[] | null;
}

export interface RawBusinessScenarioNode {
	// Export if used by other files directly
	id: number;
	uid: string;
	bianId: string | null;
	name: string | null;
	displayName: string;
	description: string | null;
	status: string | null;
}

export interface RawBehaviourQualifierNode {
	// Export if used by other files directly
	uid: string;
	name: string;
	type?: string;
	boType?: string;
	dataType?: string;
	description?: string;
}

export interface RawServiceOperationNode {
	// Export if used by other files directly
	uid: string;
	name: string;
	description?: string;
}

// RawServiceDomainDetails is now imported from serviceDomainApi.ts

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

// --- DATA PROCESSING FUNCTION (transformAndAssignTypes) ---
// (No changes needed here, keep as is)
function transformAndAssignTypes(rawData: RawRootNode[]): ProcessedNode[] {
	const transformServiceDomains = (
		sDomains: RawServiceDomainNode[]
	): ProcessedNode[] => {
		return sDomains.map((sdNode) => ({
			uid: sdNode.uid,
			name: sdNode.name,
			type: "serviceDomain",
			isFetched: false,
			isLoading: false,
			rawData: sdNode,
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

// --- Helper function to update nodes recursively (updateNodeInTree) ---
// (No changes needed here, keep as is)
function updateNodeInTree(
	nodes: ProcessedNode[],
	targetUid: string,
	updates: Partial<Omit<ProcessedNode, "children" | "rawData">> & {
		children?: ProcessedNode[];
		rawData?: any;
	}
): ProcessedNode[] {
	return nodes.map((node) => {
		if (node.uid === targetUid) {
			const newChildren =
				updates.children !== undefined ? updates.children : node.children;
			const { children, ...restOfUpdates } = updates; // eslint-disable-line @typescript-eslint/no-unused-vars
			return { ...node, ...restOfUpdates, children: newChildren };
		}
		if (node.children && node.children.length > 0) {
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

// --- TreeItem Component ---
// (No changes needed here, keep as is)
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
		if (
			node.type === "serviceDomain" &&
			newOpenState &&
			!node.isFetched &&
			!node.isLoading
		) {
			onToggleExpand(node, newOpenState);
		} else if (isPotentiallyExpandable) {
			onToggleExpand(node, newOpenState);
		}
	};

	const handleSelect = () => {
		onSelectNode(node);
	};

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
	else if (isPotentiallyExpandable && node.type !== "serviceDomain")
		itemIcon = <FolderIcon fontSize="small" />;
	else itemIcon = <Box sx={{ width: 20 }} />;

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
						width: 20,
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
						<Box sx={{ width: 20 }} />
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
				</Collapse>
			)}
		</>
	);
};

// --- ExplorerTree Component ---
// (No changes needed here, keep as is)
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

// --- FolderView Component ---
const FolderView = () => {
	const initialProcessedData = useMemo(
		() => transformAndAssignTypes(initialTreeData),
		[]
	);
	const [treeData, setTreeData] =
		useState<ProcessedNode[]>(initialProcessedData);
	const [selectedNode, setSelectedNode] = useState<ProcessedNode | null>(null);
	const [isOverviewVisible, setIsOverviewVisible] = useState(false);

	const explorerPanelRef = useRef<ImperativePanelHandle>(null);
	const detailsPanelRef = useRef<ImperativePanelHandle>(null);

	const handleToggleServiceDomainExpand = useCallback(
		async (node: ProcessedNode, isOpening: boolean) => {
			if (
				node.type === "serviceDomain" &&
				isOpening &&
				!node.isFetched &&
				!node.isLoading
			) {
				setTreeData((prevTreeData) =>
					updateNodeInTree(prevTreeData, node.uid, {
						isLoading: true,
						isFetched: false,
					})
				);

				try {
					// MODIFIED: Use the imported shared API call function
					const details: RawServiceDomainDetails =
						await fetchServiceDomainDetailsFromApi(node.uid);

					const directChildren: ProcessedNode[] = [];

					details.behaviourQualifiers?.forEach((bq) =>
						directChildren.push({
							uid: bq.uid,
							name: bq.name,
							type: "behaviourQualifier",
							rawData: bq,
						})
					);
					details.businessScenarios?.forEach((bs) =>
						directChildren.push({
							uid: bs.uid,
							name: bs.displayName || bs.name || "Unnamed Scenario",
							type: "businessScenario",
							rawData: bs,
						})
					);
					details.controlRecords?.forEach((cr) =>
						directChildren.push({
							uid: cr.uid,
							name: cr.name || "Unnamed Control Record",
							type: "controlRecord",
							rawData: cr,
						})
					);
					details.serviceOperations?.forEach((so) =>
						directChildren.push({
							uid: so.uid,
							name: so.name,
							type: "serviceOperation",
							rawData: so,
						})
					);

					setTreeData((prevTreeData) =>
						updateNodeInTree(prevTreeData, node.uid, {
							children: directChildren,
							isLoading: false,
							isFetched: true,
						})
					);
				} catch (error) {
					console.error(
						`Failed to load children for ${node.name} (UID: ${node.uid}):`,
						error
					);
					// Optionally, you could add an error state to the node to display in the tree
					setTreeData((prevTreeData) =>
						updateNodeInTree(prevTreeData, node.uid, {
							isLoading: false,
							isFetched: false,
						})
					); // Reset loading state
				}
			}
		},
		[]
	); // Dependencies: ensure this is correct, if fetchServiceDomainDetailsFromApi changes or other external state it depends on.

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
		const detailPanel = detailsPanelRef.current;
		const explorerPanel = explorerPanelRef.current;

		if (detailPanel && explorerPanel) {
			if (isOverviewVisible) {
				if (explorerPanel.getSize() !== DEFAULT_EXPLORER_PANEL_SIZE)
					explorerPanel.resize(DEFAULT_EXPLORER_PANEL_SIZE);
				if (detailPanel.getSize() !== DEFAULT_DETAILS_PANEL_SIZE)
					detailPanel.resize(DEFAULT_DETAILS_PANEL_SIZE);
				if (detailPanel.isCollapsed()) detailPanel.expand();
			} else {
				if (!detailPanel.isCollapsed()) {
					detailPanel.collapse();
				}
				if (explorerPanel.getSize() < 100) {
					explorerPanel.resize(100);
				}
			}
		}
	}, [isOverviewVisible]); // Removed selectedNode, panel resizing should only depend on visibility flag

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
					className="ResizeHandleOuter" // Ensure CSS for this exists if not using library defaults
					style={{ display: isOverviewVisible ? "flex" : "none" }}>
					{/* Ensure CSS for this exists if not using library defaults */}
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

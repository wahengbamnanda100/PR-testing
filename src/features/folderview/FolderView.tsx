// src/features/FolderView/FolderView.tsx

import React, {
	useRef,
	useEffect,
	useState,
	useMemo,
	useCallback,
} from "react";
import { Box } from "@mui/material";
import {
	Panel,
	PanelGroup,
	PanelResizeHandle,
	ImperativePanelHandle,
} from "react-resizable-panels";

import { initialTreeData } from "../../utils/data"; // Adjust path if needed
// import OverviewPanel from "../../pages/Folder/OverviewPanel";
import OverviewPanel from "./components/OverviewPanel";
import useServiceDomainLiteDetails from "./hooks/useServideDomainLite"; // Adjust path if needed
import ExplorerTree from "./ExplorerTree";
import { transformAndAssignTypes, updateNodeInTree } from "./utils/treeUtils";
import type { ProcessedNode } from "./types";
// import type { RawServiceDomainDetails } from "../../api/serviceDomainApi";

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
	const [expandedServiceDomain, setExpandedServiceDomain] =
		useState<ProcessedNode | null>(null);
	const [isOverviewVisible, setIsOverviewVisible] = useState(false);

	const explorerPanelRef = useRef<ImperativePanelHandle>(null);
	const detailsPanelRef = useRef<ImperativePanelHandle>(null);

	const serviceDomainUID =
		expandedServiceDomain?.type === "serviceDomain"
			? expandedServiceDomain.uid
			: null;
	const {
		data: details,
		loading,
		error,
	} = useServiceDomainLiteDetails(serviceDomainUID);

	const handleToggleExpand = useCallback((node: ProcessedNode) => {
		// We only care about fetching data for service domains that haven't been fetched yet.
		// console.log("Toggling expand for node:", node);
		if (node.type === "serviceDomain" && !node.isFetched && !node.isLoading) {
			setExpandedServiceDomain(node);
		}
	}, []);

	useEffect(() => {
		console.log("expandedServiceDomain", expandedServiceDomain);
	}, [expandedServiceDomain]);

	const handleSelectNode = (node: ProcessedNode) => {
		console.log("selected node", { node });
		setSelectedNode(node);
		const showOverviewForTypes: ProcessedNode["type"][] = [
			"serviceDomain",
			"behaviourQualifier",
			"businessScenario",
			"controlRecord",
			"serviceOperation",
		];
		setIsOverviewVisible(showOverviewForTypes.includes(node.type));
	};

	// Effect to handle the data fetching lifecycle for service domain children
	useEffect(() => {
		if (!expandedServiceDomain) return;
		const targetUid = expandedServiceDomain.uid;

		if (loading) {
			setTreeData((currentTree) =>
				updateNodeInTree(currentTree, targetUid, { isLoading: true })
			);
			return;
		}

		if (error) {
			console.error(`Failed to fetch children for node: ${targetUid}`, error);
			setTreeData((currentTree) =>
				updateNodeInTree(currentTree, targetUid, { isLoading: false })
			);
			// Optionally, handle the error more gracefully in the UI
			return;
		}

		// console.log("🚨🚨", details);

		if (details) {
			// Transform fetched details into ProcessedNode children

			// console.log("🚀🚀", details);
			const newChildren: ProcessedNode[] = [];

			if (details.controlRecord) {
				newChildren.push({
					uid: `${details.uid}-controlRecord`,
					name: details.controlRecord.name || "Control Record",
					type: "controlRecord",
					attribute: true,
					rawData: details.controlRecord,
				});
			}
			newChildren.push({
				uid: `${details!.uid}-businessScenarios`,
				type: "businessScenario",
				attribute: true,
				name: "Business Scenarios",
			});
			newChildren.push({
				uid: `${details!.uid}-behaviourQualifier`,
				type: "behaviourQualifier",
				attribute: true,
				name: "Behaviour Qualifier",
			});
			newChildren.push({
				uid: `${details!.bianId}-serviceOperation`,
				type: "serviceOperation",
				attribute: true,
				name: "Service Operation",
			});
			// Add similar logic for behaviourQualifiers and serviceOperations

			setTreeData((currentTree) =>
				updateNodeInTree(currentTree, targetUid, {
					children: newChildren,
					isLoading: false,
					isFetched: true,
				})
			);
		}
	}, [expandedServiceDomain, details, loading, error]);

	// Effect to manage panel resizing
	useEffect(() => {
		const detailPanel = detailsPanelRef.current;
		const explorerPanel = explorerPanelRef.current;

		if (!detailPanel || !explorerPanel) return;

		if (isOverviewVisible) {
			explorerPanel.resize(DEFAULT_EXPLORER_PANEL_SIZE);
			detailPanel.resize(DEFAULT_DETAILS_PANEL_SIZE);
		} else {
			if (!detailPanel.isCollapsed()) detailPanel.collapse();
			if (explorerPanel.getSize() < 100) explorerPanel.resize(100);
		}
	}, [isOverviewVisible]);

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
					collapsible={false}>
					<ExplorerTree
						data={treeData}
						selectedUid={selectedNode?.uid || null}
						onSelectNode={handleSelectNode}
						onToggleExpand={handleToggleExpand}
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
					minSize={30}>
					<OverviewPanel
						selectedItem={isOverviewVisible ? selectedNode : null}
						parentUid={expandedServiceDomain?.uid}
					/>
				</Panel>
			</PanelGroup>
		</Box>
	);
};

export default FolderView;

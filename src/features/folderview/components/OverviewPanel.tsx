// // src/features/FolderView/components/OverviewPanel.tsx

// import React, { useState, useEffect } from "react";
// import { Box, Typography, Paper, Tabs, Tab } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import useServiceDomainDetails from "../hooks/useServiceDomainDetails";
// import { createTabContainerSx, createTabSx } from "./style";
// import DetailsTabPanel from "./panel/DetailsTabPanel";
// import ActionsFormTabPanel from "./panel/ActionsFormTabPanel";
// import type { ProcessedNode } from "../types";
// import TreeViewComponent from "./tree/TreeView";
// import useControlRecord from "../hooks/useControlRecordApi";
// import useServiceOperations from "../hooks/useServiceOperationApi";
// import useBehaviourQualifiers from "../hooks/useBehaviourQualifierApi";

// interface OverviewPanelProps {
// 	selectedItem: ProcessedNode | null;
// }

// interface TabPanelProps {
// 	children?: React.ReactNode;
// 	index: number;
// 	value: number;
// }

// function trimAfterLastDash(input?: string | null): string {
// 	if (typeof input !== "string" || input.trim() === "") return "";

// 	const lastDashIndex = input.lastIndexOf("-");
// 	if (lastDashIndex === -1) return input; // No dash found

// 	return input.slice(0, lastDashIndex);
// }

// function TabPanel(props: TabPanelProps) {
// 	const { children, value, index, ...other } = props;
// 	return (
// 		<div
// 			role="tabpanel"
// 			hidden={value !== index}
// 			id={`overview-tabpanel-${index}`}
// 			aria-labelledby={`overview-tab-${index}`}
// 			style={{ flexGrow: 1, overflowY: "auto" }}
// 			{...other}>
// 			{value === index && (
// 				<Box sx={{ p: { xs: 2, sm: 1 }, height: "100%" }}>{children}</Box>
// 			)}
// 		</div>
// 	);
// }

// const OverviewPanel: React.FC<OverviewPanelProps> = ({ selectedItem }) => {
// 	const [tabValue, setTabValue] = useState(0);
// 	const theme = useTheme();

// 	const defaultTabs = [
// 		{
// 			label: "Details",
// 			id: "overview-tab-0",
// 			ariaControls: "overview-tabpanel-0",
// 		},
// 		{
// 			label: "Attributes",
// 			id: "overview-tab-1",
// 			ariaControls: "overview-tabpanel-1",
// 		},
// 		{
// 			label: "Actions & Forms",
// 			id: "overview-tab-2",
// 			ariaControls: "overview-tabpanel-2",
// 		},
// 	];

// 	const attributeTabs = [
// 		{
// 			label: "Attributes",
// 			id: "overview-tab-1",
// 			ariaControls: "overview-tabpanel-1",
// 		},
// 	];

// 	const serviceDomainUID =
// 		selectedItem?.type === "serviceDomain" ? selectedItem.uid : null;

// 	const controlRecordUid =
// 		selectedItem?.type === "controlRecord"
// 			? trimAfterLastDash(selectedItem?.uid)
// 			: null;

// 	const serviceOperationUid =
// 		selectedItem?.type === "serviceOperation"
// 			? trimAfterLastDash(selectedItem?.uid)
// 			: null;

// 	const behaviourQualiferUid =
// 		selectedItem?.type === "behaviourQualifier"
// 			? trimAfterLastDash(selectedItem?.uid)
// 			: null;

// 	const {
// 		data: apiData,
// 		loading,
// 		error,
// 	} = useServiceDomainDetails(serviceDomainUID, {
// 		enabled: !!serviceDomainUID,
// 	});

// 	const {
// 		data: controlRecordData,
// 		loading: controlRecordLoading,
// 		error: controlRecordError,
// 	} = useControlRecord(
// 		selectedItem?.type === "controlRecord" ? controlRecordUid : null,
// 		{ enabled: !!selectedItem?.uid && selectedItem?.type === "controlRecord" }
// 	);

// 	const {
// 		data: serviceOperationData,
// 		loading: serviceOperationLoading,
// 		error: serviceOperationError,
// 	} = useServiceOperations(
// 		selectedItem?.type === "serviceOperation" ? serviceOperationUid : null,
// 		{
// 			enabled: !!selectedItem?.uid && selectedItem?.type === "serviceOperation",
// 		}
// 	);

// 	const {
// 		data: behaviourQualifierData,
// 		loading: behaviourQualifierLoading,
// 		error: behaviourQualifierError,
// 	} = useBehaviourQualifiers(
// 		selectedItem?.type === "behaviourQualifier" ? behaviourQualiferUid : null,
// 		{
// 			enabled:
// 				!!selectedItem?.uid && selectedItem?.type === "behaviourQualifier",
// 		}
// 	);

// 	const data =
// 		selectedItem?.type === "serviceDomain"
// 			? apiData
// 			: selectedItem?.type === "controlRecord"
// 			? controlRecordData
// 			: selectedItem?.type === "serviceOperation"
// 			? serviceOperationData
// 			: behaviourQualifierData;

// 	useEffect(() => {
// 		console.log("Selected item changed:", selectedItem);
// 		// Reset to the first tab whenever a new item is selected
// 		setTabValue(0);
// 	}, [selectedItem]);

// 	const tabs = selectedItem?.attribute ? attributeTabs : defaultTabs;

// 	const loadingState =
// 		loading ||
// 		controlRecordLoading ||
// 		serviceOperationLoading ||
// 		behaviourQualifierLoading;

// 	if (!selectedItem) {
// 		return (
// 			<Paper
// 				elevation={0}
// 				sx={{
// 					p: 3,
// 					height: "100%",
// 					display: "flex",
// 					alignItems: "center",
// 					justifyContent: "center",
// 				}}>
// 				<Typography variant="body2" color="text.secondary">
// 					Select an item to see details.
// 				</Typography>
// 			</Paper>
// 		);
// 	}

// 	const tabContainerSx = createTabContainerSx(theme);
// 	const tabSx = createTabSx(theme);

// 	return (
// 		<Paper
// 			elevation={0}
// 			sx={{
// 				height: "100%",
// 				display: "flex",
// 				flexDirection: "column",
// 				p: 2,
// 				overflow: "hidden",
// 			}}>
// 			<Typography variant="h6" component="div" sx={{ mb: 1.5, flexShrink: 0 }}>
// 				{selectedItem.name}
// 			</Typography>

// 			<Box sx={tabContainerSx}>
// 				<Tabs
// 					value={tabValue}
// 					onChange={(e, v) => setTabValue(v)}
// 					aria-label="service domain details tabs"
// 					slotProps={{ indicator: { sx: { display: "none" } } }}
// 					sx={{ minHeight: "unset" }}>
// 					{tabs.map((tab, index) => (
// 						<Tab
// 							key={index}
// 							label={tab.label}
// 							id={tab.id}
// 							aria-controls={tab.ariaControls}
// 							sx={tabSx}
// 						/>
// 					))}
// 				</Tabs>
// 			</Box>

// 			<Box
// 				sx={{
// 					flexGrow: 1,
// 					overflow: "hidden",
// 					display: "flex",
// 					flexDirection: "column",
// 				}}>
// 				<TabPanel value={tabValue} index={0}>
// 					<DetailsTabPanel
// 						selectedItem={selectedItem}
// 						apiData={apiData}
// 						loading={loading}
// 						error={error}
// 					/>
// 				</TabPanel>
// 				<TabPanel value={tabValue} index={1}>
// 					<TreeViewComponent
// 						treeData={apiData}
// 						loading={loadingState}
// 						type={selectedItem?.type}
// 					/>
// 				</TabPanel>
// 				<TabPanel value={tabValue} index={2}>
// 					<ActionsFormTabPanel selectedItem={selectedItem} />
// 				</TabPanel>
// 			</Box>
// 		</Paper>
// 	);
// };

// export default OverviewPanel;

// src/features/FolderView/components/OverviewPanel.tsx

import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Tabs, Tab } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useServiceDomainDetails from "../hooks/useServiceDomainDetails";
import { createTabContainerSx, createTabSx } from "./style";
import DetailsTabPanel from "./panel/DetailsTabPanel";
import ActionsFormTabPanel from "./panel/ActionsFormTabPanel";
import type { ProcessedNode } from "../types";
import TreeViewComponent from "./tree/TreeView";
import useControlRecord from "../hooks/useControlRecordApi";
import useServiceOperations from "../hooks/useServiceOperationApi";
import useBehaviourQualifiers from "../hooks/useBehaviourQualifierApi";

interface OverviewPanelProps {
	selectedItem: ProcessedNode | null;
	parentUid?: string;
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function trimAfterLastDash(input?: string | null): string {
	if (typeof input !== "string" || input.trim() === "") return "";

	const lastDashIndex = input.lastIndexOf("-");
	if (lastDashIndex === -1) return input; // No dash found

	return input.slice(0, lastDashIndex);
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`overview-tabpanel-${index}`}
			aria-labelledby={`overview-tab-${index}`}
			style={{ flexGrow: 1, overflowY: "auto" }}
			{...other}>
			{value === index && (
				<Box sx={{ p: { xs: 2, sm: 1 }, height: "100%" }}>{children}</Box>
			)}
		</div>
	);
}

const OverviewPanel: React.FC<OverviewPanelProps> = ({
	selectedItem,
	parentUid,
}) => {
	const [tabValue, setTabValue] = useState(0);
	const theme = useTheme();

	// --- Data Fetching Hooks (unchanged) ---
	const serviceDomainUID =
		selectedItem?.type === "serviceDomain" ? selectedItem.uid : null;
	const controlRecordUid =
		selectedItem?.type === "controlRecord"
			? trimAfterLastDash(selectedItem?.uid)
			: null;
	const serviceOperationUid =
		selectedItem?.type === "serviceOperation"
			? trimAfterLastDash(selectedItem?.uid)
			: null;
	const behaviourQualiferUid =
		selectedItem?.type === "behaviourQualifier"
			? trimAfterLastDash(selectedItem?.uid)
			: null;

	const {
		data: apiData,
		loading,
		error,
	} = useServiceDomainDetails(serviceDomainUID, {
		enabled: !!serviceDomainUID,
	});

	const {
		data: controlRecordData,
		loading: controlRecordLoading,
		error: controlRecordError,
	} = useControlRecord(controlRecordUid, {
		enabled: !!selectedItem?.uid && selectedItem?.type === "controlRecord",
	});

	const {
		data: serviceOperationData,
		loading: serviceOperationLoading,
		error: serviceOperationError,
	} = useServiceOperations(serviceOperationUid, {
		enabled: !!selectedItem?.uid && selectedItem?.type === "serviceOperation",
	});

	const {
		data: behaviourQualifierData,
		loading: behaviourQualifierLoading,
		error: behaviourQualifierError,
	} = useBehaviourQualifiers(behaviourQualiferUid, {
		enabled: !!selectedItem?.uid && selectedItem?.type === "behaviourQualifier",
	});

	useEffect(() => {
		console.log("parentUid", { parentUid });
	}, [parentUid]);

	// --- Consolidated Data & Loading State (unchanged) ---
	const data =
		selectedItem?.type === "serviceDomain"
			? apiData
			: selectedItem?.type === "controlRecord"
			? controlRecordData
			: selectedItem?.type === "serviceOperation"
			? serviceOperationData
			: behaviourQualifierData;

	const loadingState =
		loading ||
		controlRecordLoading ||
		serviceOperationLoading ||
		behaviourQualifierLoading;

	useEffect(() => {
		// Reset to the first tab whenever a new item is selected
		setTabValue(0);
	}, [selectedItem]);

	// --- Centralized Tab Configuration ---
	const tabsConfig = {
		details: {
			label: "Details",
			content: (
				<DetailsTabPanel
					selectedItem={selectedItem}
					apiData={apiData}
					loading={loading}
					error={error}
				/>
			),
		},
		attributes: {
			label: "Attributes",
			content: (
				<TreeViewComponent
					treeData={data}
					parentUid={parentUid}
					loading={loadingState}
					type={selectedItem?.type}
				/>
			),
		},
		actions: {
			label: "Actions & Forms",
			content: <ActionsFormTabPanel selectedItem={selectedItem} />,
		},
	};

	// Determine which tabs are active based on the selected item's properties
	const activeTabs = selectedItem?.attribute
		? [tabsConfig.attributes]
		: [tabsConfig.details, tabsConfig.attributes, tabsConfig.actions];

	if (!selectedItem) {
		return (
			<Paper
				elevation={0}
				sx={{
					p: 3,
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}>
				<Typography variant="body2" color="text.secondary">
					Select an item to see details.
				</Typography>
			</Paper>
		);
	}

	const tabContainerSx = createTabContainerSx(theme);
	const tabSx = createTabSx(theme);

	return (
		<Paper
			elevation={0}
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				p: 2,
				overflow: "hidden",
			}}>
			<Typography variant="h6" component="div" sx={{ mb: 1.5, flexShrink: 0 }}>
				{selectedItem.name}
			</Typography>

			{/* Conditionally render the tab bar only if there's more than one tab */}
			{activeTabs.length > 1 && (
				<Box sx={tabContainerSx}>
					<Tabs
						value={tabValue}
						onChange={(e, v) => setTabValue(v)}
						aria-label="service domain details tabs"
						slotProps={{ indicator: { sx: { display: "none" } } }}
						sx={{ minHeight: "unset" }}>
						{activeTabs.map((tab, index) => (
							<Tab
								key={tab.label}
								label={tab.label}
								id={`overview-tab-${index}`}
								aria-controls={`overview-tabpanel-${index}`}
								sx={tabSx}
							/>
						))}
					</Tabs>
				</Box>
			)}

			<Box
				sx={{
					flexGrow: 1,
					overflow: "hidden",
					display: "flex",
					flexDirection: "column",
				}}>
				{/* Render tab panels dynamically */}
				{activeTabs.map((tab, index) => (
					<TabPanel key={tab.label} value={tabValue} index={index}>
						{tab.content}
					</TabPanel>
				))}
			</Box>
		</Paper>
	);
};

export default OverviewPanel;

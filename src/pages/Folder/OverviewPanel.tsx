/* eslint-disable @typescript-eslint/no-explicit-any */
// src/OverviewPanel.tsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Tabs, Tab } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles"; // Added useTheme
import useServiceDomainDetails from "./hook/useServiceDomainDetails";

// Assuming DetailView.tsx exports a component, which might be named DetailsTabPanel
// or you might be aliasing it here. Sticking to the name DetailsTabPanel for the component.
import DetailsTabPanel from "./panel/DetailView";
import ActionsFormTabPanel from "./panel/ActionsFormTabPanel";

// Assuming ProcessedNode is defined/imported from ExplorerTree.tsx or a types file
interface ProcessedNode {
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

interface OverviewPanelProps {
	selectedItem: ProcessedNode | null;
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`overview-tabpanel-${index}`}
			aria-labelledby={`overview-tab-${index}`}
			{...other}
			style={{ flexGrow: 1 }}>
			{value === index && (
				<Box sx={{ p: { xs: 2, sm: 1 }, height: "100%" }}>{children}</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `overview-tab-${index}`,
		"aria-controls": `overview-tabpanel-${index}`,
	};
}

const OverviewPanel: React.FC<OverviewPanelProps> = ({ selectedItem }) => {
	const [tabValue, setTabValue] = useState(0);
	const theme = useTheme(); // Hook to access theme for sx props

	const serviceDomainUID =
		selectedItem?.type === "serviceDomain" ? selectedItem.uid : null;
	const {
		data: apiData,
		loading,
		error,
	} = useServiceDomainDetails(serviceDomainUID);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	useEffect(() => {
		setTabValue(0);
		// console.log(selectedItem); // Keep if needed for debugging
	}, [selectedItem]);

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
					boxSizing: "border-box",
				}}>
				<Typography variant="body2" color="text.secondary">
					Select an item to see details.
				</Typography>
			</Paper>
		);
	}

	// Styles for the tab container (the light grey bar)
	const tabContainerSx = {
		alignSelf: "flex-start", // Makes the bar only as wide as its content
		flexShrink: 0,
		backgroundColor: theme.palette.mode === "light" ? "grey.100" : "grey.800",
		borderRadius: "10px", // Matches the image's rounded container
		p: theme.spacing(0.5), // Small inner padding (4px)
		mb: 2.5, // Margin below the tab bar
	};

	// Shared styles for individual Tab components
	const tabSx = {
		textTransform: "none",
		fontWeight: 500,
		fontSize: "0.875rem",
		borderRadius: "7px",
		minHeight: "34px",
		height: "34px",
		minWidth: "unset",
		py: theme.spacing(0.5),
		px: theme.spacing(1.75),
		color: theme.palette.mode === "light" ? "grey.600" : "grey.400",
		transition: theme.transitions.create(
			["background-color", "color", "font-weight", "box-shadow"],
			{
				duration: theme.transitions.duration.short,
			}
		),
		"&:not(:last-of-type)": {
			marginRight: theme.spacing(1),
		},
		"&.Mui-selected": {
			backgroundColor: theme.palette.background.paper,
			color: theme.palette.text.primary,
			fontWeight: "bold",
			boxShadow:
				theme.palette.mode === "light" ? theme.shadows[2] : theme.shadows[4],
		},
		"&:not(.Mui-selected):hover": {
			backgroundColor: alpha(
				theme.palette.action.hover,
				theme.palette.mode === "light" ? 0.03 : 0.06
			),
		},
		"&:focus-visible": {
			outline: "none", // ✅ Removes the default black outline
		},
	};

	return (
		<Paper
			elevation={0}
			sx={{
				height: "100%",
				boxSizing: "border-box",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden", // Important for child TabPanel scrolling
				p: 2, // Overall padding for the panel
				overflowY: "auto",
			}}>
			<Typography variant="h6" gutterBottom component="div" sx={{ mb: 1.5 }}>
				{selectedItem.name}
			</Typography>

			<Box sx={tabContainerSx}>
				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					aria-label="service domain details tabs"
					slotProps={{
						indicator: {
							sx: { display: "none" }, // ✅ Hides the indicator
						},
					}} // Hide the default indicator
					// Ensure Tabs component fits content, respects container padding
					sx={{ minHeight: "unset" }}>
					<Tab label="Details" {...a11yProps(0)} sx={tabSx} />
					<Tab label="Actions & Forms" {...a11yProps(1)} sx={tabSx} />
				</Tabs>
			</Box>

			<TabPanel value={tabValue} index={0}>
				<DetailsTabPanel
					selectedItem={selectedItem}
					apiData={apiData}
					loading={loading}
					error={error}
				/>
			</TabPanel>

			<TabPanel value={tabValue} index={1}>
				<ActionsFormTabPanel selectedItem={selectedItem} />
			</TabPanel>
		</Paper>
	);
};

export default OverviewPanel;

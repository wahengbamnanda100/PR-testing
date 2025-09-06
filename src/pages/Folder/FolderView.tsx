import React, { useState, useEffect } from "react";
import {
	Box,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Collapse,
	Typography,
	Paper,
	CircularProgress,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	Checkbox,
	Chip,
	Alert,
	AlertTitle,
	ListItem,
} from "@mui/material";
import {
	ExpandLess,
	ExpandMore,
	Folder,
	Article,
	ChevronRight,
} from "@mui/icons-material";
import { blue } from "@mui/material/colors";

// Initial data structure
const data = [
	{
		uid: "BIAN-13.0.0-BusinessManagement",
		name: "Business Management",
		businessDomain: [
			{
				uid: "BIAN-13.0.0-CorporateServices",
				name: "Corporate Services",
				serviceDomain: [
					{
						uid: "BIAN-13.0.0-ContinuityPlanning",
						name: "Continuity Planning",
						attributes: [
							{ name: "controlRecord" },
							{ name: "businessScenario" },
							{ name: "behaviourQualifiers" },
							{ name: "serviceOperation" },
							{ name: "characteristics" },
						],
					},
					{
						uid: "BIAN-13.0.0-AnotherService",
						name: "Another Service Example",
						attributes: [{ name: "attributeA" }, { name: "attributeB" }],
					},
				],
			},
		],
	},
];

const FolderStructureSelector = () => {
	const [expandedItems, setExpandedItems] = useState(new Set());
	const [selectedServices, setSelectedServices] = useState(new Set());
	const [selectedAttributes, setSelectedAttributes] = useState({}); // { [serviceUid]: attributeName }
	const [apiData, setApiData] = useState({});
	const [selectedApiOptions, setSelectedApiOptions] = useState({});
	const [loading, setLoading] = useState({});
	const [serviceNameMap, setServiceNameMap] = useState({});

	// Create a map for easy lookup of service names from UIDs
	useEffect(() => {
		const map = {};
		data.forEach((root) => {
			root.businessDomain?.forEach((domain) => {
				domain.serviceDomain?.forEach((service) => {
					map[service.uid] = service.name;
				});
			});
		});
		setServiceNameMap(map);
	}, []);

	// Mock API call
	const fetchApiData = async (serviceUid) => {
		setLoading((prev) => ({ ...prev, [serviceUid]: true }));
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const mockApiResponse = {
				types: [
					{ id: "type1", name: "Control Record Type", category: "management" },
					{ id: "type2", name: "Business Scenario Type", category: "planning" },
					{
						id: "type3",
						name: "Behavior Qualifier Type",
						category: "behavior",
					},
					{
						id: "type4",
						name: "Service Operation Type",
						category: "operations",
					},
					{ id: "type5", name: "Characteristics Type", category: "properties" },
				],
				metadata: { total: 5, serviceUid: serviceUid },
			};
			setApiData((prev) => ({ ...prev, [serviceUid]: mockApiResponse }));
		} catch (error) {
			console.error("API call failed:", error);
			setApiData((prev) => ({
				...prev,
				[serviceUid]: { types: [], error: "Failed to load data" },
			}));
		} finally {
			setLoading((prev) => ({ ...prev, [serviceUid]: false }));
		}
	};

	const toggleExpanded = (uid) => {
		const newExpanded = new Set(expandedItems);
		newExpanded.has(uid) ? newExpanded.delete(uid) : newExpanded.add(uid);
		setExpandedItems(newExpanded);
	};

	const toggleServiceSelection = (serviceUid) => {
		const newSelected = new Set(selectedServices);
		if (newSelected.has(serviceUid)) {
			newSelected.delete(serviceUid);
			// Clean up related state on deselection
			const newSelectedAttrs = { ...selectedAttributes };
			delete newSelectedAttrs[serviceUid];
			setSelectedAttributes(newSelectedAttrs);

			const newApiData = { ...apiData };
			delete newApiData[serviceUid];
			setApiData(newApiData);

			const newApiSelections = { ...selectedApiOptions };
			delete newApiSelections[serviceUid];
			setSelectedApiOptions(newApiSelections);
		} else {
			newSelected.add(serviceUid);
			if (!apiData[serviceUid]) {
				fetchApiData(serviceUid);
			}
		}
		setSelectedServices(newSelected);
	};

	const handleAttributeSelect = (event, serviceUid) => {
		setSelectedAttributes((prev) => ({
			...prev,
			[serviceUid]: event.target.value,
		}));
	};

	const handleApiOptionSelect = (serviceUid, optionId) => {
		setSelectedApiOptions((prev) => ({
			...prev,
			[serviceUid]: {
				...prev[serviceUid],
				[optionId]: !prev[serviceUid]?.[optionId],
			},
		}));
	};

	const renderServiceContent = (service) => (
		<Box
			sx={{
				pl: 4,
				py: 2,
				borderLeft: "1px solid",
				borderColor: "grey.300",
				ml: 2,
			}}>
			{/* Attribute Selection (Radio Group) */}
			<FormControl component="fieldset" sx={{ mb: 2 }}>
				<FormLabel
					component="legend"
					sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
					Select an Attribute
				</FormLabel>
				<RadioGroup
					name={`radio-group-${service.uid}`}
					value={selectedAttributes[service.uid] || ""}
					onChange={(e) => handleAttributeSelect(e, service.uid)}>
					{service.attributes.map((attr) => (
						<FormControlLabel
							key={attr.name}
							value={attr.name}
							control={<Radio size="small" />}
							label={
								<Typography variant="body2">
									{attr.name.replace(/([A-Z])/g, " $1").trim()}
								</Typography>
							}
						/>
					))}
				</RadioGroup>
			</FormControl>

			{/* API Data Box */}
			<Paper variant="outlined" sx={{ p: 2, bgcolor: blue[50] }}>
				<Typography variant="subtitle2" sx={{ mb: 1, color: "primary.dark" }}>
					API Types for {service.name}
				</Typography>
				{loading[service.uid] ? (
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<CircularProgress size={20} sx={{ mr: 2 }} />
						<Typography variant="body2" color="text.secondary">
							Loading API data...
						</Typography>
					</Box>
				) : apiData[service.uid] ? (
					apiData[service.uid].error ? (
						<Typography color="error" variant="body2">
							{apiData[service.uid].error}
						</Typography>
					) : (
						<FormControl component="fieldset" variant="standard">
							{apiData[service.uid].types?.map((type) => (
								<FormControlLabel
									key={type.id}
									control={
										<Checkbox
											checked={
												selectedApiOptions[service.uid]?.[type.id] || false
											}
											onChange={() =>
												handleApiOptionSelect(service.uid, type.id)
											}
											name={type.name}
											size="small"
										/>
									}
									label={
										<Box sx={{ display: "flex", alignItems: "center" }}>
											<Typography variant="body2" sx={{ mr: 1 }}>
												{type.name}
											</Typography>
											<Chip label={type.category} size="small" />
										</Box>
									}
								/>
							))}
						</FormControl>
					)
				) : null}
			</Paper>
		</Box>
	);

	const renderTree = (nodes, level = 0) => {
		return nodes.map((node) => (
			<React.Fragment key={node.uid}>
				<ListItemButton
					onClick={() =>
						"serviceDomain" in node
							? toggleServiceSelection(node.uid)
							: toggleExpanded(node.uid)
					}
					sx={{ pl: 2 + level * 2 }}>
					<ListItemIcon sx={{ minWidth: 40 }}>
						{expandedItems.has(node.uid) || selectedServices.has(node.uid) ? (
							<ExpandMore />
						) : (
							<ChevronRight />
						)}
					</ListItemIcon>
					<ListItemIcon>
						{"serviceDomain" in node ? (
							<Article sx={{ color: "success.main" }} />
						) : (
							<Folder sx={{ color: "primary.main" }} />
						)}
					</ListItemIcon>
					<ListItemText primary={node.name} />
				</ListItemButton>
				<Collapse
					in={expandedItems.has(node.uid) || selectedServices.has(node.uid)}
					timeout="auto"
					unmountOnExit>
					{node.businessDomain && (
						<List component="div" disablePadding>
							{renderTree(node.businessDomain, level + 1)}
						</List>
					)}
					{node.serviceDomain && (
						<List component="div" disablePadding>
							{renderTree(node.serviceDomain, level + 1)}
						</List>
					)}
					{selectedServices.has(node.uid) && renderServiceContent(node)}
				</Collapse>
			</React.Fragment>
		));
	};

	return (
		<Box sx={{ maxWidth: "800px", mx: "auto", p: 3 }}>
			<Paper elevation={2} sx={{ p: { xs: 2, md: 3 } }}>
				<Typography variant="h5" component="h1" gutterBottom>
					Business Domain Structure
				</Typography>
				<List
					component="nav"
					sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
					{renderTree(data)}
				</List>
			</Paper>

			{selectedServices.size > 0 && (
				<Alert severity="success" sx={{ mt: 3 }}>
					<AlertTitle>Selection Summary</AlertTitle>
					<List dense disablePadding>
						{Array.from(selectedServices).map((serviceUid) => {
							const selectedApiCount = Object.values(
								selectedApiOptions[serviceUid] || {}
							).filter(Boolean).length;
							const selectedAttr = selectedAttributes[serviceUid];

							return (
								<ListItem key={serviceUid} sx={{ display: "block", py: 1 }}>
									<Typography variant="subtitle1" fontWeight="bold">
										{serviceNameMap[serviceUid]}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										<strong>UID:</strong> {serviceUid}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										<strong>Selected Attribute:</strong>{" "}
										{selectedAttr
											? selectedAttr.replace(/([A-Z])/g, " $1").trim()
											: "None"}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										<strong>API Types Selected:</strong> {selectedApiCount}
									</Typography>
								</ListItem>
							);
						})}
					</List>
				</Alert>
			)}
		</Box>
	);
};

export default FolderStructureSelector;

// src/features/FolderView/TreeItem.tsx

import React, { useState } from "react";
import {
	ListItemButton,
	ListItemText,
	Collapse,
	Box,
	ListItemIcon,
	Divider,
	CircularProgress,
	ListItem,
	List,
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
import type { ProcessedNode } from "./types";

interface TreeItemProps {
	node: ProcessedNode;
	level?: number;
	selectedUid: string | null;
	onSelectNode: (node: ProcessedNode) => void;
	onToggleExpand: (node: ProcessedNode) => void;
}

const NodeIcon: React.FC<{ node: ProcessedNode }> = ({ node }) => {
	switch (node.type) {
		case "serviceDomain":
			return <ServiceDomainIcon fontSize="small" />;
		case "controlRecord":
			return <ControlRecordIcon fontSize="small" />;
		case "businessScenario":
			return <BusinessScenarioIcon fontSize="small" />;
		case "behaviourQualifier":
			return <BehaviourQualifierIcon fontSize="small" />;
		case "serviceOperation":
			return <ServiceOperationIcon fontSize="small" />;
		case "root":
		case "businessDomain":
			return <FolderIcon fontSize="small" />;
		default:
			return <Box sx={{ width: 20 }} />; // Placeholder
	}
};

const TreeItem: React.FC<TreeItemProps> = ({
	node,
	level = 0,
	selectedUid,
	onSelectNode,
	onToggleExpand,
}) => {
	const [open, setOpen] = useState(false);
	const nestedChildren = node.children || [];
	const isPotentiallyExpandable =
		node.type === "serviceDomain" || nestedChildren.length > 0;
	const isSelected = node.uid === selectedUid;

	const handleToggle = (event: React.MouseEvent) => {
		event.stopPropagation();
		const newOpenState = !open;
		setOpen(newOpenState);
		if (newOpenState && isPotentiallyExpandable) {
			onToggleExpand(node);
		}
	};

	const handleSelect = () => {
		onSelectNode(node);
	};

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
					{node.isLoading ? (
						<CircularProgress size={16} thickness={5} />
					) : isPotentiallyExpandable ? (
						<Box
							onClick={handleToggle}
							sx={{ display: "flex", alignItems: "center" }}>
							{open ? (
								<ExpandLess fontSize="small" />
							) : (
								<ExpandMore fontSize="small" />
							)}
						</Box>
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
					<NodeIcon node={node} />
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
					{node.isLoading ? (
						<Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
							<CircularProgress size={24} />
						</Box>
					) : nestedChildren.length > 0 ? (
						<List component="div" disablePadding dense>
							{nestedChildren.map((child) => (
								<TreeItem
									key={child.uid}
									node={child}
									level={level + 1}
									selectedUid={selectedUid}
									onSelectNode={onSelectNode}
									onToggleExpand={onToggleExpand}
								/>
							))}
						</List>
					) : node.isFetched ? (
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

// Memoize to prevent re-renders of the entire tree on selection change
export default React.memo(TreeItem);

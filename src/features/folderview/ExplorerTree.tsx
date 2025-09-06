// src/features/FolderView/ExplorerTree.tsx

import React from "react";
import { Box, List } from "@mui/material";
import TreeItem from "./TreeItem";
import type { ProcessedNode } from "./types";

interface ExplorerTreeProps {
	data: ProcessedNode[];
	selectedUid: string | null;
	onSelectNode: (node: ProcessedNode) => void;
	onToggleExpand: (node: ProcessedNode) => void;
}

const ExplorerTree: React.FC<ExplorerTreeProps> = ({
	data,
	selectedUid,
	onSelectNode,
	onToggleExpand,
}) => {
	return (
		<Box sx={{ height: "100%", overflowY: "auto", width: "100%" }}>
			<List component="nav" dense sx={{ p: 0 }}>
				{data.map((node) => (
					<TreeItem
						key={node.uid}
						node={node}
						selectedUid={selectedUid}
						level={0}
						onSelectNode={onSelectNode}
						onToggleExpand={onToggleExpand}
					/>
				))}
			</List>
		</Box>
	);
};

export default ExplorerTree;

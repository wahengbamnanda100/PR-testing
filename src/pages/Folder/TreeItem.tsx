/* eslint-disable @typescript-eslint/no-explicit-any */
// src/TreeView.js
// import React from "react";
import TreeItem from "./TreeItem";
import { List } from "@mui/material";

const TreeView = ({ data, onSelect, selectedUid }: any) => {
	return (
		<List
			component="nav"
			dense
			sx={{ width: "100%", p: 0, bgcolor: "background.paper" }}>
			{data.map((item) => (
				<TreeItem
					key={item.uid}
					item={item}
					onSelect={onSelect}
					selectedUid={selectedUid}
				/>
			))}
		</List>
	);
};

export default TreeView;

// src/components/ActionsFormTabPanel.tsx
import React from "react";
import { Typography, TextField, Grid } from "@mui/material";

// Assuming ProcessedNode is defined/imported from a shared types file or ExplorerTree.tsx
// If not, define it minimally here for props:
interface ProcessedNode {
	uid: string;
	name: string;
	type: "root" | "businessDomain" | "serviceDomain";
}

interface ActionsFormTabPanelProps {
	selectedItem: ProcessedNode; // selectedItem will always be non-null when this panel is shown
}

const ActionsFormTabPanel: React.FC<ActionsFormTabPanelProps> = ({
	selectedItem,
}) => {
	return (
		<>
			<Typography variant="h6" gutterBottom>
				Example Form
			</Typography>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<TextField
						fullWidth
						label="Setting Name"
						variant="outlined"
						margin="dense"
						helperText="A sample configuration field."
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						fullWidth
						label="Value"
						variant="outlined"
						margin="dense"
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						label="Description"
						variant="outlined"
						margin="dense"
						multiline
						rows={3}
					/>
				</Grid>
				<Grid item xs={12} sx={{ mt: 1 }}>
					<Typography variant="caption" color="text.secondary">
						This is a placeholder form. Actual actions would depend on the
						selected '{selectedItem.name}'.
					</Typography>
				</Grid>
			</Grid>
		</>
	);
};

export default ActionsFormTabPanel;

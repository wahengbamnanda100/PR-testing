// src/features/FolderView/components/panel/ActionsFormTabPanel.tsx

import React from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";
import type { ActionsFormTabPanelProps } from "../../types";

const ActionsFormTabPanel: React.FC<ActionsFormTabPanelProps> = ({
	selectedItem,
}) => {
	return (
		<Box>
			<Typography variant="subtitle1">
				Actions for {selectedItem.name}
			</Typography>
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
			{/* Example: Add a form or action buttons here */}
		</Box>
	);
};

export default ActionsFormTabPanel;

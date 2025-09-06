import React from "react";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import {
	Box,
	Typography,
	Chip,
	Stack,
	Tooltip,
	styled,
	// Theme,
} from "@mui/material"; // Added Theme

// Define a more specific type for serOrFeed if possible, e.g., "service" | "feedback"
// For now, keeping as string based on original props.
interface LabelBodyProps {
	title: React.ReactNode;
	description: React.ReactNode | string; // Keep as is, tooltip handles complex ReactNode
	status?: string;
	data_type?: React.ReactNode | string; // Could be simple string or more complex
	type1?: string; // Optional if not always present
	serOrFeed: string; // "service" | "feedback" would be better
	level?: string; // Optional
	editEnabled: boolean;
	boType?: string;
	handleItemClick?: (type?: string) => void;
}

// Modernized Tooltip (can be reused from previous example or defined here)
const ModernTooltip = styled(Tooltip)(({ theme }) => ({
	[`& .MuiTooltip-tooltip`]: {
		backgroundColor:
			theme.palette.mode === "dark"
				? theme.palette.grey[700]
				: theme.palette.grey[800],
		color: theme.palette.common.white,
		boxShadow: theme.shadows[3],
		fontSize: theme.typography.pxToRem(13),
		padding: theme.spacing(1, 1.5),
		borderRadius: theme.shape.borderRadius,
	},
	[`& .MuiTooltip-arrow`]: {
		color:
			theme.palette.mode === "dark"
				? theme.palette.grey[700]
				: theme.palette.grey[800],
	},
}));

const LabelBody: React.FC<LabelBodyProps> = ({
	title,
	description,
	status,
	data_type,
	type1,
	serOrFeed,
	level,
	editEnabled,
	boType,
	handleItemClick,
}) => {
	const isFeedback = serOrFeed === "feedback";
	// Conditions for showing chips (can be simplified)
	const showChips = level !== "level2";
	// const showChips = true; // Show chips for all except level 2
	const hasDescription = description && String(description).trim() !== ""; // Check if description has content

	const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (handleItemClick) {
			e.stopPropagation(); // Correctly prevents bubbling
			handleItemClick(boType); // Pass the entire nodeData object back up
		}
	};

	return (
		<Box
			onClick={onClick}
			sx={{
				display: "flex",
				alignItems: "flex-start", // Align drag handle to the top of the content
				p: 1.5,
				cursor: "pointer",
				width: "100%",
				height: "100%", // Or 'auto' if height should be content-driven
				borderRadius: 1,
				"&:hover": {
					// backgroundColor: "action.hover",
				},
			}}>
			<Box
				sx={{
					display: "flex",
					color: "action.active",
					pt: 0.3 /* Fine-tune vertical alignment */,
				}}>
				<DragHandleIcon
					fontSize="small" /* className="d_tree_container_drag" */
				/>
			</Box>

			<Stack spacing={0.75} sx={{ ml: 1.5, flexGrow: 1, overflow: "hidden" }}>
				{" "}
				{/* Reduced ml slightly */}
				<Typography
					variant="subtitle1"
					component="div"
					fontWeight="medium"
					sx={{
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}>
					{title}
				</Typography>
				{!editEnabled && isFeedback && type1 && (
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ fontStyle: "italic" }}>
						{type1}
					</Typography>
				)}
				{hasDescription && (
					<ModernTooltip title={description} placement="top" arrow>
						<Typography
							// className="oneLineText" // Handled by sx props
							variant="body2"
							color="text.primary" // More subdued for description
							sx={{
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis",
								maxWidth: "100%", // Ensure it doesn't overflow container
								display: "inline-block", // For tooltip to attach correctly to truncated text
							}}>
							{/* If description is ReactNode, it's rendered as is. If string, it's fine. */}
							{typeof description === "string" ? description : description}
						</Typography>
					</ModernTooltip>
				)}
				{/* Stack for Status and Data Type Chips */}
				{showChips &&
					(status || data_type || boType) && ( // Only render stack if there's at least one chip to show
						<Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
							{status && (
								<Chip
									// title={"Status : " + status} // MUI Chip has built-in title on hover if label is truncated
									label={status}
									color="primary" // Consider dynamic coloring like previous example if needed
									size="small"
									sx={{
										height: "auto",
										"& .MuiChip-label": {
											py: 0.25,
											px: 0.75,
											fontSize: "0.75rem",
											fontWeight: 500,
										},
									}}
								/>
							)}
							{data_type && (
								<Chip
									// title={"Data Type : " + data_type}
									label={typeof data_type === "string" ? data_type : "Data"} // Handle ReactNode for label
									color="info" // Consider dynamic coloring
									size="small"
									sx={{
										height: "auto",
										"& .MuiChip-label": {
											py: 0.25,
											px: 0.75,
											fontSize: "0.75rem",
											fontWeight: 500,
										},
									}}
								/>
							)}
							{boType && (
								<Chip
									label={
										<Typography variant="caption" fontWeight={500}>
											{boType}
										</Typography>
									}
									color="secondary"
									size="small"
									sx={{
										height: "auto",
										"& .MuiChip-label": {
											py: 0.25,
											px: 0.75,
											fontSize: "0.75rem",
											fontWeight: 500,
										},
									}}
								/>
							)}
						</Stack>
					)}
			</Stack>
		</Box>
	);
};

export default LabelBody;

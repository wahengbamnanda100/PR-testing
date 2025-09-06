/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Typography, Chip, Link, Stack } from "@mui/material";

type ActionType =
	| "Update"
	| "Retrieve"
	| "Notify"
	| "Execute"
	| "Exchange"
	| "Request"
	| "Initiate"
	| "Control"
	| string;

interface LabelBodyProps {
	title: string;
	action: ActionType;
	endpoint: React.ReactNode;
	status?: string;
	data_type?: React.ReactNode | string;
	type1?: string;
	serOrFeed: "service" | "feedback";
	level?: string;
	editEnabled: boolean;
	uid: string;
	type: string;
}

const SOLabel: React.FC<LabelBodyProps> = ({
	title,
	action,
	endpoint,
	type1,
	uid,
	type,
	serOrFeed,
	editEnabled,
}) => {
	const isFeedback = serOrFeed === "feedback";

	let chipProps: {
		color?:
			| "primary"
			| "secondary"
			| "error"
			| "warning"
			| "info"
			| "success"
			| "default";
		sx?: any;
	} = { color: "default" };

	switch (action) {
		case "Initiate":
		case "Request":
			chipProps = { color: "info" };
			break;
		case "Retrieve":
		case "Exchange":
			chipProps = { color: "primary" };
			break;
		case "Execute":
		case "Control":
			chipProps = { color: "warning" };
			break;
		case "Update":
			chipProps = { color: "success" };
			break;
		case "Notify":
			chipProps = { color: "secondary" };
			break;
		default:
			chipProps = { sx: { bgcolor: "grey.300", color: "text.primary" } };
			break;
	}

	function generateSwaggerEditorUrl(
		prefix: string,
		procedureName: string,
		action: string
	): string {
		const filenameParts = uid.split("-");
		const filename = filenameParts.pop(); // get the last segment for filename

		const combinedHeader = `${prefix} - ${procedureName}`;
		const formattedHeader = encodeURIComponent(combinedHeader);

		const baseUrl = import.meta.env.VITE_SWAGGEREDITOR_URL;
		const version = import.meta.env.VITE_YAML_VERSION;

		return `${baseUrl}?ver=${version}&filename=${filename}.yaml&iso=false/#/${formattedHeader}/${
			action + procedureName
		}`;
	}

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center", // Align drag handle with the content block
				p: 1.5,
				cursor: "pointer",
				width: "100%",
				height: "100%",
				borderRadius: 1,
				"&:hover": {
					// backgroundColor: "action.hover",
				},
			}}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					color: "action.active",
					alignSelf: "flex-start",
					mt: 0.5,
				}}>
				{" "}
				{/* Align drag handle to top of content stack */}
				<DragHandleIcon fontSize="small" />
			</Box>

			{/* Main content stack (vertical) */}
			<Stack spacing={0.5} sx={{ ml: 2, flexGrow: 1, overflow: "hidden" }}>
				{/* Row for Title and Action Chip */}
				<Stack
					direction="row"
					alignItems="center" // Vertically align items in this row
					spacing={1} // Space between title and chip
					sx={{ width: "100%" }} // Ensure this row takes full available width
				>
					<Typography
						variant="subtitle1"
						component="div"
						fontWeight="medium"
						sx={{
							color: "primary",
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
							flexShrink: 1, // Allow title to shrink if chip is present
							minWidth: 0, // Important for flex item truncation
						}}>
						{title}
					</Typography>

					{action && (
						<Chip
							label={action}
							size="small"
							color={
								chipProps.color !== "default" ? chipProps.color : undefined
							}
							sx={{
								px: 1,
								py: 0.5,
								flexShrink: 0, // Prevent chip from shrinking
								height: "auto",
								...(chipProps.color === "default" && chipProps.sx),
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

				{/* Conditional type1, still part of the main vertical stack */}
				{!editEnabled && isFeedback && type1 && (
					<Typography variant="body2" color="text.secondary">
						{type1}
					</Typography>
				)}

				{/* Endpoint link, still part of the main vertical stack */}
				<Link
					href={generateSwaggerEditorUrl(type, title, action)}
					underline="hover"
					target="_blank"
					rel="noopener noreferrer"
					variant="body2"
					sx={{
						display: "flex",
						alignItems: "center",
						color: "primary.main",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						maxWidth: "100%",
					}}>
					<Box
						component="span"
						sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
						{endpoint}
					</Box>
					<OpenInNewIcon sx={{ fontSize: "1rem", ml: 0.5, flexShrink: 0 }} />
				</Link>
			</Stack>
		</Box>
	);
};

export default SOLabel;

// src/features/FolderView/components/styles.ts

import { styled, Theme } from "@mui/material/styles";
import { Accordion, AccordionDetails, alpha, Grid } from "@mui/material";

/**
 * Generates the sx prop for the container of the Tabs.
 * @param theme The MUI theme object.
 */
export const createTabContainerSx = (theme: Theme) => ({
	alignSelf: "flex-start",
	flexShrink: 0,
	backgroundColor: theme.palette.mode === "light" ? "grey.100" : "grey.800",
	borderRadius: "10px",
	p: 0.5, // 4px
	mb: 2.5,
});

/**
 * Generates the sx prop for an individual Tab component.
 * @param theme The MUI theme object.
 */
export const createTabSx = (theme: Theme) => ({
	textTransform: "none",
	fontWeight: 500,
	fontSize: "0.875rem",
	borderRadius: "7px",
	height: "34px",
	minHeight: "34px",
	py: 0.5,
	px: 1.75,
	color: theme.palette.mode === "light" ? "grey.600" : "grey.400",
	transition: theme.transitions.create(
		["background-color", "color", "box-shadow"],
		{
			duration: theme.transitions.duration.short,
		}
	),
	"&:not(:last-of-type)": {
		marginRight: 1,
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
		outline: "none", // Removes default focus outline for a cleaner look
	},
});

export const StyledGrid = styled(Grid)({
	width: "100%",
	height: "fit-content",
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	alignItems: "start",
	gap: 10,
});

export const StyledAccordian = styled(Accordion)({
	width: "100%",
	fontSize: "18px",
	color: "darkslategray",
	backgroundColor: "#E1F1E1",
	padding: 3,
	display: "flex",
	flexDirection: "column",
	// gap: 5,
	borderRadius: 10,
	border: "2px solid #507C82",
});

export const StyledAccordianDetails = styled(AccordionDetails)({
	fontSize: "16px",
	color: "darkslategray",
	paddingBottom: 10,
	marginRight: 1,
	// mb: 3
	// marginBottom: '30px',
});

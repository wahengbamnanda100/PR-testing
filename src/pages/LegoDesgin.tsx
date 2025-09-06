/// <reference types="vite-plugin-svgr/client" />
import { Box, Typography } from "@mui/material";
import LegoLayout from "../features/legoDesign/Legolayout";
// import SDGroup from "../assets/sd_icons/sd_group.svg?react";
// import StackedBlocks from "../components/Lego/StackBlocks";

const LegoDesign = () => {
	// const businessDirectionsData = [
	// 	{ id: "ir", label: "Investor Relations" },
	// 	{ id: "cr", label: "Corporate Relationship" },
	// 	{ id: "cash", label: "Corporate Alliance and Stake Holder" },
	// 	{ id: "cc1", label: "Corporate Communications" },
	// 	{ id: "cc2", label: "Corporate Communications" },
	// 	{ id: "cc3", label: "Corporate Communications" },
	// 	{ id: "cc4", label: "Corporate Communications" },
	// 	{ id: "cash2", label: "Corporate Alliance and Stake Holder" },
	// ];

	return (
		// <Box
		// 	sx={{
		// 		height: "100%",
		// 		width: "100%",
		// 		display: "flex",
		// 		flexDirection: "column",
		// 		alignItems: "center",
		// 		bgcolor: "white",
		// 		color: "black",
		// 	}}>
		// 	<Typography variant="h4">Lego Design Landscape</Typography>
		// 	<Box
		// 		sx={{
		// 			display: "flex",
		// 			flexDirection: "row",
		// 			alignItems: "center",
		// 			justifyContent: "center",
		// 			flexWrap: "wrap",
		// 			// width: "100%",
		// 			gap: 2,
		// 			marginTop: 2,
		// 		}}>
		// 		{Array.from({ length: 8 }).map((_, index) => (
		// 			<BusinessArea key={index} />
		// 		))}
		// 	</Box>
		// </Box>
		<LegoLayout />
	);
};

export default LegoDesign;

// const BusinessArea = () => {
// 	return (
// 		<Box>
// 			<StackedBlocks
// 				title="Project Phases"
// 				items={[
// 					{ id: "plan", label: "Planning" },
// 					{ id: "dev", label: "Development" },
// 					{ id: "test", label: "Testing" },
// 					{ id: "deploy", label: "Deployment" },
// 				]}
// 			/>
// 			<SDGroup style={{ width: "400px", height: "300px" }} />
// 		</Box>
// 	);
// };

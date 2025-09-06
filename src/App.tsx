// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router";
import { Button, Container, Box } from "@mui/material";
import PageOne from "./pages/XyFlowMapper";
import PageTwo from "./pages/ZoomPan";
import PageThree from "./pages/ZoomPinchPan";
// import FolderStructure from "./pages/FolderStructure";
import LegoDesign from "./pages/LegoDesgin";
import Folder from "./features/folderview/FolderView";
import Landcape from "./features/landscapeZoom/Landscape";
import AdaptiveGrid from "./pages/AUtoGrid";

// Home page with two centered buttons linking to different pages.
const Home: React.FC = () => (
	<Container
		maxWidth="sm"
		sx={{
			height: "100vh",
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
		}}>
		<Box sx={{ display: "flex", gap: 2 }}>
			<Button variant="contained" component={Link} to="/page-one">
				Page One
			</Button>
			<Button variant="contained" component={Link} to="/page-two">
				Page Two
			</Button>
			<Button variant="contained" component={Link} to="/page-three">
				Page three (Zoom Pan Pich)
			</Button>
			<Button variant="contained" component={Link} to="/folder">
				Folder structere
			</Button>
			<Button variant="contained" component={Link} to="/lego">
				Lego design
			</Button>
			<Button variant="contained" component={Link} to="/landscape">
				New Landscape grid
			</Button>
			<Button variant="contained" component={Link} to="/autoGrid">
				Auto Grid
			</Button>
		</Box>
	</Container>
);

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/page-one" element={<PageOne />} />
				<Route path="/page-two" element={<PageTwo />} />
				<Route path="/page-three" element={<PageThree />} />
				<Route path="/folder" element={<Folder />} />
				<Route path="/lego" element={<LegoDesign />} />
				<Route path="/landscape" element={<Landcape />} />
				<Route path="/autoGrid" element={<AdaptiveGrid />} />
			</Routes>
		</Router>
	);
};

export default App;

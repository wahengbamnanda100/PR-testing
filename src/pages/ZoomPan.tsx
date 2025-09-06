import React, { useState, useRef, useEffect } from "react";
import {
	Box,
	Button,
	Typography,
	Paper,
	IconButton,
	useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import HomeIcon from "@mui/icons-material/Home";

interface Slide {
	id: string;
	x: number;
	y: number;
	scale: number;
	title: string;
	content: string;
	bgColor?: string;
}

const ZoomPan: React.FC = () => {
	const theme = useTheme();

	// Sample slides with positioning data
	const slides: Slide[] = [
		{
			id: "slide1",
			x: 0,
			y: 0,
			scale: 1,
			title: "Welcome",
			content:
				"Welcome to our Prezi-like presentation built with React and Material UI!",
			bgColor: "#bbdefb", // light blue
		},
		{
			id: "slide2",
			x: 1000,
			y: 200,
			scale: 0.5,
			title: "Key Features",
			content:
				"Non-linear navigation, zooming interface, and Material UI components",
			bgColor: "#c8e6c9", // light green
		},
		{
			id: "slide3",
			x: -800,
			y: 500,
			scale: 0.7,
			title: "Benefits",
			content:
				"Engage your audience with dynamic transitions and professional UI elements",
			bgColor: "#f8bbd0", // light pink
		},
		{
			id: "slide4",
			x: 200,
			y: -700,
			scale: 0.6,
			title: "Use Cases",
			content:
				"Perfect for storytelling, portfolio presentations, and complex ideas",
			bgColor: "#ffe0b2", // light orange
		},
		{
			id: "slide5",
			x: -500,
			y: -300,
			scale: 0.8,
			title: "Conclusion",
			content: "Thank you for watching our Prezi-style presentation!",
			bgColor: "#e1bee7", // light purple
		},
	];

	const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
	const [transform, setTransform] = useState<string>("");
	const [additionalScale, setAdditionalScale] = useState<number>(1);
	const canvasRef = useRef<HTMLDivElement>(null);

	// Handle keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight" || e.key === "ArrowDown") {
				navigateToSlide((currentSlideIndex + 1) % slides.length);
			} else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
				navigateToSlide(
					(currentSlideIndex - 1 + slides.length) % slides.length
				);
			} else if (e.key === "+") {
				zoomIn();
			} else if (e.key === "-") {
				zoomOut();
			} else if (e.key === "Home") {
				resetZoom();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [currentSlideIndex, slides.length, additionalScale]);

	// Initial transition to the first slide
	useEffect(() => {
		navigateToSlide(0);
	}, []);

	const navigateToSlide = (index: number) => {
		const slide = slides[index];
		const scale = (1 / slide.scale) * additionalScale;

		// Calculate the transformation to center the slide and apply the scale
		const newTransform = `translate(${-slide.x}px, ${-slide.y}px) scale(${scale})`;

		setTransform(newTransform);
		setCurrentSlideIndex(index);
	};

	// Zoom functionality
	const zoomIn = () => {
		const newScale = additionalScale * 1.2;
		setAdditionalScale(newScale);
		updateTransform(newScale);
	};

	const zoomOut = () => {
		const newScale = additionalScale * 0.8;
		setAdditionalScale(newScale);
		updateTransform(newScale);
	};

	const resetZoom = () => {
		setAdditionalScale(1);
		updateTransform(1);
	};

	const updateTransform = (newScale: number) => {
		const slide = slides[currentSlideIndex];
		const scale = (1 / slide.scale) * newScale;
		const newTransform = `translate(${-slide.x}px, ${-slide.y}px) scale(${scale})`;
		setTransform(newTransform);
	};

	return (
		<Box
			sx={{
				width: "100vw",
				height: "100vh",
				bgcolor: "#f5f5f5",
				overflow: "hidden",
				position: "relative",
			}}>
			<Box
				sx={{
					width: "100vw",
					height: "100vh",
					overflow: "hidden",
					position: "relative",
				}}>
				<Box
					ref={canvasRef}
					sx={{
						transform: transform,
						transition: "transform 1.5s ease-in-out",
						width: "10000px",
						height: "10000px",
						position: "absolute",
						left: "50%",
						top: "50%",
						marginLeft: "-5000px",
						marginTop: "-5000px",
					}}>
					{slides.map((slide) => (
						<Paper
							key={slide.id}
							elevation={6}
							sx={{
								position: "absolute",
								left: `${slide.x + 5000}px`,
								top: `${slide.y + 5000}px`,
								transform: `scale(${slide.scale})`,
								width: "800px",
								padding: "40px",
								borderRadius: "10px",
								background: slide.bgColor || "white",
								transition: "box-shadow 0.3s ease",
								"&:hover": {
									boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
								},
							}}>
							<Typography variant="h2" component="h2" gutterBottom>
								{slide.title}
							</Typography>
							<Typography variant="h5" component="p">
								{slide.content}
							</Typography>
						</Paper>
					))}
				</Box>
			</Box>

			{/* Navigation Controls - Bottom Right */}
			<Box
				sx={{
					position: "fixed",
					bottom: "20px",
					right: "20px",
					zIndex: 10,
					display: "flex",
					gap: 1,
				}}>
				<Button
					variant="contained"
					color="primary"
					startIcon={<ArrowBackIcon />}
					onClick={() =>
						navigateToSlide(
							(currentSlideIndex - 1 + slides.length) % slides.length
						)
					}>
					Previous
				</Button>
				<Button
					variant="contained"
					color="primary"
					endIcon={<ArrowForwardIcon />}
					onClick={() =>
						navigateToSlide((currentSlideIndex + 1) % slides.length)
					}>
					Next
				</Button>
			</Box>

			{/* Zoom Controls - Top Right */}
			<Box
				sx={{
					position: "fixed",
					top: "20px",
					right: "20px",
					zIndex: 10,
					display: "flex",
					gap: 1,
					bgcolor: "rgba(255, 255, 255, 0.7)",
					borderRadius: 1,
					padding: 0.5,
				}}>
				<IconButton onClick={zoomIn} color="primary" size="small">
					<ZoomInIcon />
				</IconButton>
				<IconButton onClick={zoomOut} color="primary" size="small">
					<ZoomOutIcon />
				</IconButton>
				<IconButton onClick={resetZoom} color="primary" size="small">
					<HomeIcon />
				</IconButton>
			</Box>

			{/* Slide Indicators - Bottom Center */}
			<Box
				sx={{
					position: "fixed",
					bottom: "20px",
					left: "50%",
					transform: "translateX(-50%)",
					zIndex: 10,
					display: "flex",
					gap: 1,
					bgcolor: "rgba(255, 255, 255, 0.7)",
					borderRadius: 4,
					padding: 1,
				}}>
				{slides.map((_, index) => (
					<IconButton
						key={index}
						onClick={() => navigateToSlide(index)}
						color={index === currentSlideIndex ? "primary" : "default"}
						size="small"
						sx={{ padding: 0.5 }}>
						<FiberManualRecordIcon fontSize="small" />
					</IconButton>
				))}
			</Box>
		</Box>
	);
};

export default ZoomPan;

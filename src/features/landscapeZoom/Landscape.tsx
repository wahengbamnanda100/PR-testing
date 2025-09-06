// src/App.tsx
import {
	TransformWrapper,
	TransformComponent,
	useControls,
} from "react-zoom-pan-pinch";
import ServiceDomainCanvas from "./components/ServiceDomainCanvas";

// A helper component to access the zoom controls
const Controls = () => {
	const { zoomIn, zoomOut, resetTransform } = useControls();
	return (
		<div className="controls">
			<button onClick={() => zoomIn()}>Zoom In +</button>
			<button onClick={() => zoomOut()}>Zoom Out -</button>
			<button onClick={() => resetTransform()}>Reset</button>
		</div>
	);
};

function LandscapeZoom() {
	return (
		<div className="app-container-land">
			<TransformWrapper
				initialScale={0.4}
				initialPositionX={-600}
				initialPositionY={-400}
				minScale={0.1}
				limitToBounds={false}>
				{() => (
					<>
						<header className="header">
							<h1>BIAN Service Domain Landscape v13.0.0</h1>
							<Controls />
						</header>
						<main className="main-content">
							<TransformComponent
								wrapperStyle={{ width: "100%", height: "100%" }}
								contentStyle={{ width: "fit-content" }}>
								<ServiceDomainCanvas />
							</TransformComponent>
						</main>
					</>
				)}
			</TransformWrapper>
		</div>
	);
}

export default LandscapeZoom;

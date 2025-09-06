/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
	useRef,
	useCallback,
	useMemo,
	useEffect,
	useState,
} from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import LayoutDemo from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import SharedServiceDomainDrawer from "./components/SharedServiceDomainDrawer";
import { fetchServiceDomainDetails, ServiceDomainDetails } from "./services/serviceDomainApi";

// Optimized ServiceDomainCanvas with React.memo to prevent unnecessary re-renders
const ServiceDomainCanvas = React.memo(
	React.forwardRef<HTMLDivElement, { scale?: number; onServiceClick?: (service: any, serviceIndex: number) => void }>((props, ref) => (
		<div
			ref={ref}
			style={{
				width: "200vw",
				height: "200vh",
				padding: "8px",
				boxSizing: "border-box",
				overflow: "hidden",
				// outline: "1px solid",
				// outlineColor: "white",
			}}>
			<LayoutDemo scale={props.scale} onServiceClick={props.onServiceClick} />
		</div>
	))
);

ServiceDomainCanvas.displayName = "ServiceDomainCanvas";

function LegoLayout() {
	const transformWrapperRef = useRef<any>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const [initialState, setInitialState] = useState({
		scale: 0.5,
		positionX: -600,
		positionY: -400,
	});

	const [currentScale, setCurrentScale] = useState(1);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	// Shared service domain drawer state
	const [drawerState, setDrawerState] = useState<{
		isOpen: boolean;
		service: any;
		serviceIndex: number;
		serviceDetails: ServiceDomainDetails | null;
		isLoading: boolean;
		error: string | null;
	}>({
		isOpen: false,
		service: null,
		serviceIndex: 0,
		serviceDetails: null,
		isLoading: false,
		error: null,
	});

	const handleToggleSidebar = useCallback(() => {
		setIsSidebarCollapsed(!isSidebarCollapsed);
	}, [isSidebarCollapsed]);

	const handleServiceClick = useCallback(async (service: any, serviceIndex: number) => {
		// Set initial state with loading
		setDrawerState({
			isOpen: true,
			service,
			serviceIndex,
			serviceDetails: null,
			isLoading: true,
			error: null,
		});

		// Check if service has UID
		if (!service.uid && !service.id) {
			setDrawerState(prev => ({
				...prev,
				serviceDetails: null,
				isLoading: false,
				error: 'Service UID is not available for this service domain',
			}));
			return;
		}

		try {
			// Fetch service domain details using the UID
			const uid = service.uid || service.id;
			const serviceDetails = await fetchServiceDomainDetails(uid);
			
			// Update state with successful response
			setDrawerState(prev => ({
				...prev,
				serviceDetails,
				isLoading: false,
				error: null,
			}));
		} catch (error) {
			// Handle error
			const errorMessage = error instanceof Error 
				? error.message 
				: 'Failed to load service domain details';
			
			setDrawerState(prev => ({
				...prev,
				serviceDetails: null,
				isLoading: false,
				error: errorMessage,
			}));
		}
	}, []);

	const handleCloseDrawer = useCallback(() => {
		setDrawerState({
			isOpen: false,
			service: null,
			serviceIndex: 0,
			serviceDetails: null,
			isLoading: false,
			error: null,
		});
	}, []);

	// Effect to calculate proper initial state after mount
	useEffect(() => {
		const calculateInitialState = () => {
			if (containerRef.current) {
				const container = containerRef.current;

				const containerWidth = container.clientWidth;
				const containerHeight = container.clientHeight;

				// Use the actual canvas dimensions (200vw x 200vh)
				const canvasWidthPx = window.innerWidth * 2; // 200vw in pixels
				const canvasHeightPx = window.innerHeight * 2; // 200vh in pixels

				// Calculate scale to fit full canvas content with padding
				const scaleX = (containerWidth * 0.95) / canvasWidthPx;
				const scaleY = (containerHeight * 0.95) / canvasHeightPx;
				const scale = Math.min(scaleX, scaleY);

				// Center the content
				const scaledWidth = canvasWidthPx * scale;
				const scaledHeight = canvasHeightPx * scale;
				const positionX = (containerWidth - scaledWidth) / 2;
				const positionY = (containerHeight - scaledHeight) / 2;

				setInitialState({
					scale,
					positionX,
					positionY,
				});
			}
		};

		// Small delay to ensure DOM is fully rendered
		const timeoutId = setTimeout(calculateInitialState, 100);

		// Recalculate on window resize
		const handleResize = () => {
			const timeoutId = setTimeout(calculateInitialState, 100);
			return () => clearTimeout(timeoutId);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			clearTimeout(timeoutId);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// Memoized styles to prevent object recreation

	const wrapperStyle = useMemo(
		() => ({
			width: "100%",
			height: "100%",
		}),
		[]
	);

	const contentStyle = useMemo(
		() => ({
			width: "100%",
		}),
		[]
	);

	// Memoized render function to prevent recreation on every render
	const renderTransformContent = useCallback(
		() => (
			<main className="main-content">
				<TransformComponent
					wrapperStyle={wrapperStyle}
					contentStyle={contentStyle}>
					<ServiceDomainCanvas ref={contentRef} scale={currentScale} onServiceClick={handleServiceClick} />
				</TransformComponent>
			</main>
		),
		[wrapperStyle, contentStyle, currentScale, handleServiceClick]
	);

	return (
		<div style={{ 
			width: "100vw",
			height: "100vh",
			display: "flex", 
			flexDirection: "row",
			overflow: "hidden",
			position: "relative",
			backgroundColor: "#000"
		}}>
			{/* Sidebar */}
			{!isSidebarCollapsed && (
				<div style={{ 
					flexShrink: 0, 
					zIndex: 1000,
					height: "100vh"
				}}>
					<Sidebar
						isCollapsed={isSidebarCollapsed}
						onToggleCollapse={handleToggleSidebar}
						onServiceClick={handleServiceClick}
					/>
				</div>
			)}
			
			{/* Floating hamburger button when sidebar is collapsed */}
			{isSidebarCollapsed && (
				<Sidebar
					isCollapsed={isSidebarCollapsed}
					onToggleCollapse={handleToggleSidebar}
					onServiceClick={handleServiceClick}
				/>
			)}

			{/* Main Canvas Area */}
			<div style={{ 
				flex: 1, 
				height: "100vh",
				width: "auto",
				overflow: "hidden",
				position: "relative",
				minWidth: 0
			}}>
				{/* Canvas */}
				<div style={{ width: "100%", height: "100%" }}>
					<TransformWrapper
						ref={transformWrapperRef}
						initialScale={initialState.scale}
						initialPositionX={initialState.positionX}
						initialPositionY={initialState.positionY}
						minScale={initialState.scale * 0.1}
						maxScale={2}
						limitToBounds={false}
						centerOnInit
						onTransformed={(ref, state) => {
							setCurrentScale(state.scale);
						}}
						doubleClick={{
							disabled: false,
							mode: "reset",
						}}
						wheel={{
							wheelDisabled: false,
							touchPadDisabled: false,
							step: 0.1,
						}}
						pinch={{
							disabled: false,
							step: 5,
						}}>
						{renderTransformContent}
					</TransformWrapper>
				</div>
			</div>

			{/* Service Domain Panel */}
			<SharedServiceDomainDrawer
				isOpen={drawerState.isOpen}
				onClose={handleCloseDrawer}
				service={drawerState.service}
				serviceIndex={drawerState.serviceIndex}
				serviceDetails={drawerState.serviceDetails}
				isLoading={drawerState.isLoading}
				error={drawerState.error}
			/>
		</div>
	);
}

export default React.memo(LegoLayout);

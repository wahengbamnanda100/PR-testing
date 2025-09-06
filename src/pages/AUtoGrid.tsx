import { useState, useEffect, useRef } from "react";

export default function AdaptiveGrid() {
	const [containerWidth, setContainerWidth] = useState(400);
	const [containerHeight, setContainerHeight] = useState(300);
	const [minBoxSize, setMinBoxSize] = useState(30);
	const [maxBoxSize, setMaxBoxSize] = useState(80);
	const [selectedBoxes, setSelectedBoxes] = useState(new Set());
	const containerRef = useRef(null);

	// Calculate grid based on container size and box constraints
	const calculateGrid = (width, height, minSize, maxSize) => {
		const gap = 2; // Gap between boxes

		// Try different box sizes from max to min
		for (let boxSize = maxSize; boxSize >= minSize; boxSize--) {
			const cols = Math.floor((width + gap) / (boxSize + gap));
			const rows = Math.floor((height + gap) / (boxSize + gap));

			if (cols > 0 && rows > 0) {
				const totalBoxes = cols * rows;
				const actualBoxWidth = Math.floor((width - (cols - 1) * gap) / cols);
				const actualBoxHeight = Math.floor((height - (rows - 1) * gap) / rows);
				const actualBoxSize = Math.min(actualBoxWidth, actualBoxHeight);

				return {
					cols,
					rows,
					totalBoxes,
					boxSize: actualBoxSize,
					containerFitWidth: cols * actualBoxSize + (cols - 1) * gap,
					containerFitHeight: rows * actualBoxSize + (rows - 1) * gap,
				};
			}
		}

		// Fallback: single box
		return {
			cols: 1,
			rows: 1,
			totalBoxes: 1,
			boxSize: Math.min(width, height, maxSize),
			containerFitWidth: Math.min(width, height, maxSize),
			containerFitHeight: Math.min(width, height, maxSize),
		};
	};

	const gridInfo = calculateGrid(
		containerWidth,
		containerHeight,
		minBoxSize,
		maxBoxSize
	);

	const handleBoxClick = (index) => {
		const newSelected = new Set(selectedBoxes);
		if (newSelected.has(index)) {
			newSelected.delete(index);
		} else {
			newSelected.add(index);
		}
		setSelectedBoxes(newSelected);
	};

	// Predefined container sizes for examples
	const presetContainers = [
		{ name: "Small Square", width: 200, height: 200 },
		{ name: "Medium Rectangle", width: 400, height: 300 },
		{ name: "Wide Rectangle", width: 600, height: 200 },
		{ name: "Tall Rectangle", width: 250, height: 500 },
		{ name: "Large Square", width: 500, height: 500 },
	];

	return (
		<div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">
				Container-Filling Adaptive Grid
			</h1>

			{/* Controls */}
			<div className="bg-white p-4 rounded-lg shadow-md mb-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Container Size Controls */}
					<div>
						<h3 className="font-semibold text-gray-700 mb-3">Container Size</h3>
						<div className="space-y-3">
							<div>
								<label className="block text-sm text-gray-600 mb-1">
									Width: {containerWidth}px
								</label>
								<input
									type="range"
									min="150"
									max="800"
									value={containerWidth}
									onChange={(e) => setContainerWidth(parseInt(e.target.value))}
									className="w-full"
								/>
							</div>
							<div>
								<label className="block text-sm text-gray-600 mb-1">
									Height: {containerHeight}px
								</label>
								<input
									type="range"
									min="150"
									max="600"
									value={containerHeight}
									onChange={(e) => setContainerHeight(parseInt(e.target.value))}
									className="w-full"
								/>
							</div>
						</div>

						{/* Preset Buttons */}
						<div className="mt-3">
							<p className="text-sm text-gray-600 mb-2">Quick presets:</p>
							<div className="flex flex-wrap gap-2">
								{presetContainers.map((preset) => (
									<button
										key={preset.name}
										onClick={() => {
											setContainerWidth(preset.width);
											setContainerHeight(preset.height);
										}}
										className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors">
										{preset.name}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Box Size Constraints */}
					<div>
						<h3 className="font-semibold text-gray-700 mb-3">
							Box Size Limits
						</h3>
						<div className="space-y-3">
							<div>
								<label className="block text-sm text-gray-600 mb-1">
									Min Box Size: {minBoxSize}px
								</label>
								<input
									type="range"
									min="15"
									max="50"
									value={minBoxSize}
									onChange={(e) => setMinBoxSize(parseInt(e.target.value))}
									className="w-full"
								/>
							</div>
							<div>
								<label className="block text-sm text-gray-600 mb-1">
									Max Box Size: {maxBoxSize}px
								</label>
								<input
									type="range"
									min="40"
									max="120"
									value={maxBoxSize}
									onChange={(e) => setMaxBoxSize(parseInt(e.target.value))}
									className="w-full"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Grid Info */}
				<div className="mt-4 p-3 bg-gray-50 rounded text-sm">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div>
							<span className="font-medium">Grid:</span> {gridInfo.cols} ×{" "}
							{gridInfo.rows}
						</div>
						<div>
							<span className="font-medium">Total Boxes:</span>{" "}
							{gridInfo.totalBoxes}
						</div>
						<div>
							<span className="font-medium">Box Size:</span> {gridInfo.boxSize}
							px
						</div>
						<div>
							<span className="font-medium">Selected:</span>{" "}
							{selectedBoxes.size}
						</div>
					</div>
				</div>
			</div>

			{/* Main Grid Container */}
			<div className="bg-white p-6 rounded-lg shadow-md mb-6">
				<h3 className="font-semibold text-gray-700 mb-4">Adaptive Grid</h3>
				<div className="flex justify-center">
					<div
						ref={containerRef}
						className="border-2 border-gray-300 rounded-lg p-2 bg-gray-50"
						style={{
							width: `${containerWidth}px`,
							height: `${containerHeight}px`,
							display: "grid",
							gridTemplateColumns: `repeat(${gridInfo.cols}, ${gridInfo.boxSize}px)`,
							gridTemplateRows: `repeat(${gridInfo.rows}, ${gridInfo.boxSize}px)`,
							gap: "2px",
							justifyContent: "center",
							alignContent: "center",
						}}>
						{Array.from({ length: gridInfo.totalBoxes }, (_, index) => (
							<div
								key={index}
								onClick={() => handleBoxClick(index)}
								className={`
                  border border-gray-400 rounded cursor-pointer transition-all duration-200
                  flex items-center justify-center font-medium
                  ${
										selectedBoxes.has(index)
											? "bg-blue-500 text-white shadow-lg transform scale-105 border-blue-600"
											: "bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md"
									}
                `}
								style={{
									width: `${gridInfo.boxSize}px`,
									height: `${gridInfo.boxSize}px`,
									fontSize: `${Math.max(10, gridInfo.boxSize / 4)}px`,
								}}>
								{index + 1}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Live Examples */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{presetContainers.map((preset, presetIndex) => {
					const presetGrid = calculateGrid(preset.width, preset.height, 20, 60);
					return (
						<div
							key={presetIndex}
							className="bg-white p-4 rounded-lg shadow-md">
							<h3 className="font-medium text-gray-700 mb-2">
								{preset.name} ({preset.width}×{preset.height})
							</h3>
							<p className="text-xs text-gray-500 mb-3">
								{presetGrid.cols}×{presetGrid.rows} = {presetGrid.totalBoxes}{" "}
								boxes
							</p>
							<div
								className="border border-gray-300 rounded bg-gray-50 p-1 mx-auto"
								style={{
									width: `${preset.width / 2}px`,
									height: `${preset.height / 2}px`,
									display: "grid",
									gridTemplateColumns: `repeat(${presetGrid.cols}, 1fr)`,
									gridTemplateRows: `repeat(${presetGrid.rows}, 1fr)`,
									gap: "1px",
								}}>
								{Array.from({ length: presetGrid.totalBoxes }, (_, i) => (
									<div
										key={i}
										className="bg-green-100 border border-green-300 rounded flex items-center justify-center"
										style={{ fontSize: "8px" }}>
										{i + 1}
									</div>
								))}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

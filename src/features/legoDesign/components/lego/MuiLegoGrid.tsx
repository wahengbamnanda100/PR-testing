/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import MuiLegoBlock from "./MuiLegoBlock";

interface LegoBlock {
	id?: string;
	rows: number;
	cols: number;
	content?: { label: string }[];
}

interface GridInfo {
	cols: number;
	rows: number;
	totalBoxes: number;
	boxSize: number;
}

interface MuiLegoGridProps {
	data?: LegoBlock[];
	blocks?: LegoBlock[];
	autoGenerate?: boolean;
}

const MuiLegoGrid = ({
	data,
	blocks,
	autoGenerate = true
}: MuiLegoGridProps) => {
	const [gridData, setGridData] = useState<LegoBlock[]>([]);
	const [containerSize, setContainerSize] = useState({ width: 400, height: 300 });
	const [gridInfo, setGridInfo] = useState<GridInfo>({ cols: 1, rows: 1, totalBoxes: 1, boxSize: 100 });
	const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});
	const containerRef = useRef<HTMLDivElement>(null);

	// Calculate grid to fill container completely
	const calculateGrid = (width: number, height: number): GridInfo => {
		// Determine optimal grid size based on container dimensions
		const aspectRatio = width / height;

		let cols: number, rows: number;

		if (aspectRatio > 2) {
			// Very wide container - use horizontal layout
			cols = Math.min(6, Math.max(2, Math.floor(width / 80)));
			rows = Math.max(1, Math.floor(height / 60));
		} else if (aspectRatio < 0.5) {
			// Very tall container - use vertical layout
			cols = Math.max(1, Math.floor(width / 60));
			rows = Math.min(6, Math.max(2, Math.floor(height / 80)));
		} else {
			// Square-ish container - use balanced grid
			const totalArea = width * height;
			const targetBlockArea = 4000; // Target area per block
			const targetBlocks = Math.max(1, Math.min(12, Math.floor(totalArea / targetBlockArea)));

			// Find best cols/rows combination
			cols = Math.max(1, Math.round(Math.sqrt(targetBlocks * aspectRatio)));
			rows = Math.max(1, Math.ceil(targetBlocks / cols));
		}

		// Ensure reasonable limits
		cols = Math.min(6, Math.max(1, cols));
		rows = Math.min(4, Math.max(1, rows));

		return {
			cols,
			rows,
			totalBoxes: cols * rows,
			boxSize: 0, // Not used in new approach
		};
	};

	// Generate lego blocks to fill the calculated grid
	const generateGridBlocks = (totalBoxes: number): LegoBlock[] => {
		const blocks: LegoBlock[] = [];

		for (let i = 0; i < totalBoxes; i++) {
			const rows = Math.floor(Math.random() * 3) + 1; // 1-3 rows
			const cols = Math.floor(Math.random() * 3) + 1; // 1-3 cols
			const contentCount = rows * cols;
			const content = Array.from({ length: contentCount }, (_, index) => ({
				label: `${index + 1}`
			}));

			blocks.push({
				id: `block-${i}`,
				rows,
				cols,
				content,
			});
		}

		return blocks;
	};

	// Measure container size with better accuracy
	useEffect(() => {
		const updateContainerSize = () => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				// Account for padding (8px total)
				const newWidth = Math.max(50, rect.width - 8);
				const newHeight = Math.max(50, rect.height - 8);

				setContainerSize({ width: newWidth, height: newHeight });
			}
		};

		const resizeObserver = new ResizeObserver(updateContainerSize);
		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		// Initial measurement with a small delay to ensure DOM is ready
		const timeoutId = setTimeout(updateContainerSize, 100);

		return () => {
			resizeObserver.disconnect();
			clearTimeout(timeoutId);
		};
	}, []);

	// Calculate grid info when container size changes
	useEffect(() => {
		const newGridInfo = calculateGrid(containerSize.width, containerSize.height);
		setGridInfo(newGridInfo);
	}, [containerSize]);

	// Generate grid data when grid info changes
	useEffect(() => {
		if (blocks) {
			// Convert blocks with rows/cols to LegoBlock format
			const convertedBlocks = blocks.map((block, index) => ({
				id: block.id || `block-${index}`,
				rows: block.rows,
				cols: block.cols,
				content: block.content || Array.from({ length: block.rows * block.cols }, (_, i) => ({ label: `${i + 1}` }))
			}));
			setGridData(convertedBlocks);
		} else if (data) {
			setGridData(data);
		} else if (autoGenerate) {
			setGridData(generateGridBlocks(gridInfo.totalBoxes));
		}
	}, [blocks, data, autoGenerate, gridInfo.totalBoxes]);

	return (
		<div
			ref={containerRef}
			style={{
				width: "100%",
				height: "100%",
				padding: "2px",
				boxSizing: "border-box",
				display: "grid",
				gridTemplateColumns: `repeat(${gridInfo.cols}, 1fr)`,
				gridTemplateRows: `repeat(${gridInfo.rows}, 1fr)`,
				gap: "2px",
				backgroundColor: "transparent",
				overflow: "hidden", // Prevent any overflow
			}}>
			{gridData.map((block) => (
				<MuiLegoBlock
					key={block.id || 'unknown'}
					ref={(el) => {
						if (block.id) {
							blockRefs.current[block.id] = el;
						}
					}}
					id={block.id || 'unknown'}
					rows={block.rows}
					cols={block.cols}
					content={block.content || []}
				/>
			))}
		</div>
	);
};

export default MuiLegoGrid;

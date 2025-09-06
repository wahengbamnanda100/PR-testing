// src/components/StackedBlocks.jsx
import React from "react";
import LegoBlock from "./LegoBlock";

// Dimensions from your SVG and visual analysis
const BLOCK_SVG_WIDTH = 49;
const BLOCK_SVG_TOTAL_HEIGHT = 55; // Full height of the imported SVG
const EFFECTIVE_STACKING_OFFSET_Y = 32; // Vertical distance from top of one block to top of next

const TEXT_OFFSET_X = 25; // Horizontal space between block and text
const TEXT_VERTICAL_ANCHOR_OFFSET = 25; // Fine-tune Y pos of text relative to block's (0,0). (9px for stud + 32px/2 for main body center)

const TITLE_FONT_SIZE = 24;
const LABEL_FONT_SIZE = 14; // Adjusted from original example, looks more like it.
const GLOBAL_PADDING = 30; // Padding around the entire SVG content

const StackedBlocks = ({ title, items }) => {
	if (!items || items.length === 0) {
		return null;
	}

	const titleAreaHeight = TITLE_FONT_SIZE + 20; // Space for title + some margin below it

	const blocksStartX = GLOBAL_PADDING;
	// Y position for the very top of the first (highest) block in the stack
	const blocksStartY = GLOBAL_PADDING + titleAreaHeight;

	// Calculate overall SVG dimensions
	const maxTextWidth = 250; // Estimate or calculate if you have the text content
	const svgWidth =
		blocksStartX +
		BLOCK_SVG_WIDTH +
		TEXT_OFFSET_X +
		maxTextWidth +
		GLOBAL_PADDING;

	let contentHeight;
	if (items.length > 0) {
		contentHeight =
			(items.length - 1) * EFFECTIVE_STACKING_OFFSET_Y + BLOCK_SVG_TOTAL_HEIGHT;
	} else {
		contentHeight = 0;
	}
	const svgHeight =
		GLOBAL_PADDING + titleAreaHeight + contentHeight + GLOBAL_PADDING;

	return (
		<svg width={svgWidth} height={svgHeight} xmlns="http://www.w3.org/2000/svg">
			<title>{title}</title>
			<text
				x={GLOBAL_PADDING} // Align title with the start of the blocks
				y={GLOBAL_PADDING + TITLE_FONT_SIZE / 2 + 5} // Nudge for better baseline
				fontSize={TITLE_FONT_SIZE}
				fontWeight="bold"
				dominantBaseline="middle"
				fill="#333">
				{title}
			</text>

			{items.map((item, index) => {
				// blockY is the y-coordinate for the top-left (0,0) of the SVG block's viewBox
				const blockY = blocksStartY + index * EFFECTIVE_STACKING_OFFSET_Y;

				// Position text vertically centered on the main body of the block
				const textY = blockY + TEXT_VERTICAL_ANCHOR_OFFSET;

				return (
					<g key={item.id || index}>
						<LegoBlock x={blocksStartX} y={blockY} />
						<text
							x={blocksStartX + BLOCK_SVG_WIDTH + TEXT_OFFSET_X}
							y={textY}
							fontSize={LABEL_FONT_SIZE}
							fill="#555" // Dark grey for text
							dominantBaseline="middle"
							style={{ fontFamily: "Arial, sans-serif" }} // Match example font more closely
						>
							{item.label}
						</text>
					</g>
				);
			})}
		</svg>
	);
};

export default StackedBlocks;

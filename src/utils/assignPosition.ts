// utils/assignPositions.ts
import { FlatNode } from "./flatenTree"; // Adjust path as needed
import { allocateChildrenInGrid } from "./allocateChildren"; // Adjust path as needed

export type Position = {
	x: number;
	y: number;
	width: number;
	height: number;
};

// Assume FlatNode structure based on usage:
// Needs at least: node.type (optional), node.x, node.y, node.width, node.height (for level 0),
// indexPath, level, parentIndexPath
/* Example:
interface FlatNode {
    node: {
        type?: string; // The type property we need to check
        x: number;
        y: number;
        width: number;
        height: number;
        // other original node data...
    };
    indexPath: string;
    level: number;
    parentIndexPath: string | null;
    // other properties added during flattening...
}
*/

export function assignPositions(flatNodes: FlatNode[]): {
	[indexPath: string]: Position;
} {
	const posMap: { [indexPath: string]: Position } = {};
	// Optimization: Keep track of parents whose children layout has been calculated
	const processedParentLayouts = new Set<string>();

	// 1. Assign initial positions for top-level (level 0) nodes
	flatNodes
		.filter((n) => n.level === 0)
		.forEach((parentFlatNode) => {
			const { node, indexPath } = parentFlatNode;
			// Basic validation: Ensure level 0 nodes have dimensions needed
			if (
				typeof node.x !== "number" ||
				typeof node.y !== "number" ||
				typeof node.width !== "number" ||
				typeof node.height !== "number" ||
				node.width <= 0 ||
				node.height <= 0
			) {
				console.warn(
					`assignPositions: Level 0 node ${indexPath} has invalid/missing position/dimensions. Skipping.`
				);
				return; // Skip nodes without base dimensions
			}
			posMap[indexPath] = {
				x: node.x,
				y: node.y,
				width: node.width,
				height: node.height,
			};
		});

	// 2. Calculate positions for children (level > 0)
	flatNodes
		// Consider only nodes that are children/grandchildren etc. AND have a parent path
		.filter((n) => n.level > 0 && n.parentIndexPath)
		.forEach((childNode) => {
			const parentPath = childNode.parentIndexPath!; // Not null because of filter

			// Optimization: If layout for this parent's children is already done, skip
			if (processedParentLayouts.has(parentPath)) {
				return;
			}

			const parentPos = posMap[parentPath];

			// Check if parent position was calculated (might be missing if level 0 was invalid)
			if (!parentPos) {
				console.warn(
					`assignPositions: Parent position for ${parentPath} not found. Cannot layout children like ${childNode.indexPath}.`
				);
				processedParentLayouts.add(parentPath); // Mark as processed to avoid repeated warnings
				return;
			}

			// Find the actual parent FlatNode object to check its type
			// This lookup could be optimized further if performance is critical (e.g., Map<string, FlatNode>)
			const parentNode = flatNodes.find((n) => n.indexPath === parentPath);

			if (!parentNode) {
				console.warn(
					`assignPositions: Parent FlatNode object for ${parentPath} not found. Cannot check type.`
				);
				// Decide how to handle: proceed with original parentPos or skip? Let's skip layout.
				processedParentLayouts.add(parentPath);
				return;
			}

			// Get all siblings belonging to this parent
			const siblings = flatNodes.filter(
				(n) => n.parentIndexPath === parentPath
			);

			if (siblings.length === 0) {
				// Should not happen given we are iterating through a child, but safe check.
				processedParentLayouts.add(parentPath);
				return;
			}

			// --- Determine the bounding box for child layout ---
			let layoutParentBox: Position;
			// Check the PARENT's type
			if (parentNode.node.type === "arrow") {
				const reducedWidth = Math.max(1, parentPos.width - 30); // Reduce width, ensure it's at least 1
				const reduceX = parentPos.x + 15;

				if (parentPos.width > 0 && reducedWidth <= 0) {
					console.warn(
						`assignPositions: Reducing width by 30 for arrow parent ${parentPath} resulted in non-positive width. Clamping to 1.`
					);
				}

				layoutParentBox = {
					...parentPos, // copy x, y, height
					width: reducedWidth,
					x: reduceX,
					// Optional: Adjust x if the 30 reduction should happen from one side
					// x: parentPos.x + 30, // If arrow is on the left, shift content right
					// x: parentPos.x + 15, // If reduction should be centered
				};
			} else if (parentNode.node.type === "bigArrow") {
				const reducedWidth = Math.max(1, parentPos.width - 80); // Reduce width, ensure it's at least 1
				const reduceX = parentPos.x + 40;

				if (parentPos.width > 0 && reducedWidth <= 0) {
					console.warn(
						`assignPositions: Reducing width by 30 for arrow parent ${parentPath} resulted in non-positive width. Clamping to 1.`
					);
				}

				layoutParentBox = {
					...parentPos, // copy x, y, height
					width: reducedWidth,
					x: reduceX,
					// Optional: Adjust x if the 30 reduction should happen from one side
					// x: parentPos.x + 30, // If arrow is on the left, shift content right
					// x: parentPos.x + 15, // If reduction should be centered
				};
			} else {
				// Use the original parent position if type is not "arrow"
				layoutParentBox = parentPos;
			}
			// --- End bounding box determination ---

			// Calculate layout for ALL siblings within the determined box
			// Use a consistent padding value (e.g., 2)
			const layout = allocateChildrenInGrid(
				layoutParentBox,
				siblings.length,
				1 // Using padding=2, adjust if needed (your comment mentioned 4 columns, but passed 1)
			);

			// Assign the calculated positions to each sibling
			if (layout.length === siblings.length) {
				siblings.forEach((sib, i) => {
					posMap[sib.indexPath] = layout[i];
				});
			} else {
				console.error(
					`assignPositions: Layout calculation failed for children of ${parentPath}. Expected ${siblings.length} positions, got ${layout.length}.`
				);
				// Don't assign positions if the layout function failed or returned unexpected results
			}

			// Mark this parent's layout as done
			processedParentLayouts.add(parentPath);
		});

	return posMap;
}

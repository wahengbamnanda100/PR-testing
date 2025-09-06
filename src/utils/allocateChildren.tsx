type Position = {
	x: number;
	y: number;
	width: number;
	height: number;
};

type ParentBox = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export function allocateChildrenInGridv1(
	parent: ParentBox,
	childrenLength: number,
	padding: number = 2
): Position[] {
	if (childrenLength === 0) return [];

	const cols = Math.ceil(Math.sqrt(childrenLength));
	const rows = Math.ceil(childrenLength / cols);

	const availableWidth = parent.width - padding * (cols + 1);
	const availableHeight = parent.height - padding * (rows + 1);

	const boxWidth = availableWidth / cols;
	const boxHeight = availableHeight / rows;

	const positions: Position[] = [];

	for (let i = 0; i < childrenLength; i++) {
		const row = Math.floor(i / cols);
		const col = i % cols;

		const x = parent.x + padding + col * (boxWidth + padding);
		const y = parent.y + padding + row * (boxHeight + padding);

		positions.push({
			x,
			y,
			width: boxWidth,
			height: boxHeight,
		});
	}

	return positions;
}

export function allocateChildrenInGrid(
	parent: ParentBox,
	childrenLength: number,
	padding: number = 2
): Position[] {
	// --- Input Validation ---
	if (childrenLength <= 0) {
		console.warn("allocateChildrenInGrid: childrenLength must be positive.");
		return [];
	}
	if (parent.width <= 0 || parent.height <= 0) {
		console.warn("allocateChildrenInGrid: Parent dimensions must be positive.");
		return [];
	}

	let cols: number;
	let rows: number;

	// --- Determine Grid Dimensions based on Parent Aspect Ratio ---
	if (parent.height > parent.width) {
		// Parent is TALLER than wide. Aim for a TALLER grid (more rows)
		// to make individual children WIDER than tall.
		const parentAspectRatio = parent.height / parent.width; // Will be > 1
		// Estimate rows based on aspect ratio, favoring more rows
		// Use ceil to ensure we have enough rows
		rows = Math.ceil(Math.sqrt(childrenLength * parentAspectRatio));
		// Calculate columns needed to fit children given the rows
		// Use ceil to ensure we have enough columns
		cols = Math.ceil(childrenLength / rows);
	} else {
		// Parent is WIDER than tall (or square). Aim for a WIDER grid (more columns)
		// (This is the original behavior, makes children squarer or taller)
		cols = Math.ceil(Math.sqrt(childrenLength));
		rows = Math.ceil(childrenLength / cols);
	}

	// Ensure we have at least 1 row and 1 column if childrenLength > 0
	// (ceil should handle this, but belt-and-suspenders)
	if (cols <= 0) cols = 1;
	if (rows <= 0) rows = 1;

	// --- Calculate Available Space and Child Dimensions ---
	// Subtract padding for all gaps (cols+1 gaps horizontally, rows+1 vertically)
	const availableWidth = parent.width - padding * (cols + 1);
	const availableHeight = parent.height - padding * (rows + 1);

	// If padding is too large for the dimensions, children can't fit.
	if (availableWidth <= 0 || availableHeight <= 0) {
		console.warn(
			`allocateChildrenInGrid: Parent dimensions (${parent.width}x${parent.height}) too small for ${childrenLength} children with ${cols} cols, ${rows} rows, and padding ${padding}. Available space non-positive.`
		);
		// Optional: Could try a fallback with 0 padding, or just return empty.
		return [];
	}

	const boxWidth = availableWidth / cols;
	const boxHeight = availableHeight / rows;

	// --- Generate Positions ---
	const positions: Position[] = [];
	for (let i = 0; i < childrenLength; i++) {
		// Determine grid cell for this child
		const r = Math.floor(i / cols); // Row index (0-based)
		const c = i % cols; // Column index (0-based)

		// Calculate top-left corner (x, y) for the child box
		const x = parent.x + padding + c * (boxWidth + padding);
		const y = parent.y + padding + r * (boxHeight + padding);

		positions.push({
			x,
			y,
			width: boxWidth,
			height: boxHeight,
		});
	}

	return positions;
}

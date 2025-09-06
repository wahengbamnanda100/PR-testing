/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/flattenTree.ts
export type FlatNode = {
	indexPath: string; // e.g., "0-1-2"
	level: number; // 0 = top, 1 = child, 2 = grandchild
	parentIndexPath?: string;
	type?: string | null;
	label: string;
	node: any; // reference to original node (could include uid, etc.)
};

export function flattenTree(tree: any[]): FlatNode[] {
	const result: FlatNode[] = [];

	function recurse(
		node: any,
		level: number,
		indexPath: string,
		parentIndexPath?: string
	) {
		result.push({
			indexPath,
			level,
			parentIndexPath,
			label: node.label,
			type: node.type || null,
			node,
		});

		if (node.children?.length) {
			node.children.forEach((child, i) =>
				recurse(child, level + 1, `${indexPath}-${i}`, indexPath)
			);
		}
	}

	tree.forEach((top, i) => recurse(top, 0, `${i}`));
	return result;
}

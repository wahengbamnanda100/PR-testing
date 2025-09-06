// src/features/FolderView/utils/treeUtils.ts

import type {
	ProcessedNode,
	RawRootNode,
	RawBusinessDomainNode,
	RawServiceDomainNode,
} from "../types";

/**
 * Transforms the initial raw data into the ProcessedNode structure for the tree.
 */
export function transformAndAssignTypes(
	rawData: RawRootNode[]
): ProcessedNode[] {
	const transformServiceDomains = (
		sDomains: RawServiceDomainNode[]
	): ProcessedNode[] => {
		return sDomains.map((sdNode) => ({
			uid: sdNode.uid,
			name: sdNode.name,
			type: "serviceDomain",
			isFetched: false,
			isLoading: false,
			children: [], // Start with empty children
			rawData: sdNode,
		}));
	};

	const transformBusinessDomains = (
		bDomains: RawBusinessDomainNode[]
	): ProcessedNode[] => {
		return bDomains.map((bdNode) => ({
			uid: bdNode.uid,
			name: bdNode.name,
			type: "businessDomain",
			children: transformServiceDomains(bdNode.serviceDomain),
			rawData: bdNode,
		}));
	};

	return rawData.map((rootNode) => ({
		uid: rootNode.uid,
		name: rootNode.name,
		type: "root",
		children: transformBusinessDomains(rootNode.businessDomain),
		rawData: rootNode,
	}));
}

/**
 * Recursively finds a node by its UID and applies partial updates.
 * Returns a new tree array to ensure immutability.
 */
export function updateNodeInTree(
	nodes: ProcessedNode[],
	targetUid: string,
	updates: Partial<ProcessedNode>
): ProcessedNode[] {
	return nodes.map((node) => {
		if (node.uid === targetUid) {
			return { ...node, ...updates };
		}
		if (node.children) {
			const updatedChildren = updateNodeInTree(
				node.children,
				targetUid,
				updates
			);
			// If the children array instance has changed, it means an update occurred.
			if (updatedChildren !== node.children) {
				return { ...node, children: updatedChildren };
			}
		}
		return node;
	});
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/FolderView/types.ts

// --- RAW DATA TYPES (from API/initial data) ---

export interface RawServiceDomainNode {
	uid: string;
	name: string;
}

export interface RawBusinessDomainNode {
	uid: string;
	name: string;
	serviceDomain: RawServiceDomainNode[];
}

export interface RawRootNode {
	uid: string;
	name: string;
	businessDomain: RawBusinessDomainNode[];
}

export interface RawAttribute {
	type: string | null;
	boType: string | null;
	dataType: string | null;
	dataTypeBianId: string | null;
	direction: string | null;
	parentObjectName: string | null;
	name: string | null;
	description: string | null;
}

export interface RawControlRecordNode {
	uid: string;
	name: string | null;
	description: string | null;
	bianId: string | null;
	serviceDomainID: number;
	serviceDomainName: string | null;
	attributes: RawAttribute[] | null;
}

export interface RawBusinessScenarioNode {
	id: number;
	uid: string;
	bianId: string | null;
	name: string | null;
	displayName: string;
	description: string | null;
	status: string | null;
}

export interface RawBehaviourQualifierNode {
	uid: string;
	name: string;
	type?: string;
	boType?: string;
	dataType?: string;
	description?: string;
}

export interface RawServiceOperationNode {
	uid: string;
	name: string;
	description?: string;
}

// The combined details fetched for a single Service Domain
export interface RawServiceDomainDetails {
	uid: string; // Assuming details object also has a UID
	bianId: string | null; // Assuming details object also has a bianId
	controlRecord: RawControlRecordNode;
	businessScenarios: RawBusinessScenarioNode[];
	behaviourQualifiers: RawBehaviourQualifierNode[];
	serviceOperations: RawServiceOperationNode[];
}

// --- PROCESSED NODE TYPE (for the UI tree) ---

export type NodeType =
	| "root"
	| "businessDomain"
	| "serviceDomain"
	| "controlRecord"
	| "businessScenario"
	| "behaviourQualifier"
	| "serviceOperation";

export interface ProcessedNode {
	uid: string;
	name: string;
	type: NodeType;
	attribute?: boolean;
	children?: ProcessedNode[];
	isFetched?: boolean;
	isLoading?: boolean;
	rawData?: any; // To store the original data if needed
}

export interface ApiServiceDomainDetailResponse {
	displayName: string;
	examplesOfUse: string;
	executiveSummary: string;
	apiStatus: string;
	roleDefinition: string;
	status: string;
	uid: string; // This is the service domain UID, matches the one passed
	name: string; // The original name
	// Add any other fields you might need from the full API response
	// For instance:
	// characteristics: { functionalPattern: string, assetType: string, ... };
	// businessArea: { name: string, ... };
	// meta: { version: string, ... };
}

interface ApiServiceDomainDetail {
	displayName: string;
	roleDefinition: string;
	executiveSummary: string;
	examplesOfUse: string;
	keyFeatures: string;
	apiStatus: string;
	status: string;
	// Add other properties if known
}

export interface DetailsTabPanelProps {
	selectedItem: ProcessedNode;
	apiData: ApiServiceDomainDetail | null;
	loading: boolean;
	error: Error | null;
}

export interface ActionsFormTabPanelProps {
	selectedItem: ProcessedNode;
}

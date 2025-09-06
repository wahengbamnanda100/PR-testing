// src/types.ts

export interface ProcessedNode {
	uid: string;
	name: string;
	type: "root" | "businessDomain" | "serviceDomain";
	// children?: ProcessedNode[];
	// You might want to add a field for image if you want it to be dynamic, e.g., imageUrl?: string;
}

// Interface for API Service Domain Detail Response
// This is an assumption based on the original use of apiData, adjust if your actual hook returns differently
export interface ApiServiceDomainDetailResponse {
	displayName: string;
	roleDefinition: string;
	executiveSummary: string;
	examplesOfUse: string;
	apiStatus: string;
	status: string;
	// Add other properties returned by your useServiceDomainDetails hook
}

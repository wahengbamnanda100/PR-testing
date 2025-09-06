// src/api/serviceDomainApi.ts
import type {
	RawControlRecordNode,
	RawBusinessScenarioNode,
	RawBehaviourQualifierNode,
	RawServiceOperationNode,
} from "../components/ExplorerTree";

export interface RawServiceDomainDetails {
	controlRecords: RawControlRecordNode[];
	businessScenarios: RawBusinessScenarioNode[];
	behaviourQualifiers: RawBehaviourQualifierNode[];
	serviceOperations: RawServiceOperationNode[];
}

// Mock data, similar to what was in ExplorerTree.tsx but distinct for clarity
const mockApiDataStore: Record<string, RawServiceDomainDetails> = {
	sd1_uid: {
		behaviourQualifiers: [
			{
				uid: "api_sd1_bq1",
				name: "BQ Alpha (from API)",
				description: "Details for BQ Alpha",
			},
			{ uid: "api_sd1_bq2", name: "BQ Beta (from API)", boType: "Customer" },
		],
		businessScenarios: [
			{
				id: 1010,
				uid: "api_sd1_bs1",
				displayName: "BS Gamma Scenario (API)",
				name: "BS Gamma API",
				description: "Scenario Gamma API",
				bianId: "BIAN_BS_G_API",
				status: "Active",
			},
		],
		controlRecords: [
			{
				uid: "api_sd1_cr1",
				name: "CR Delta Record (API)",
				description: "Control Record Delta API",
				serviceDomainID: 1,
				serviceDomainName: "Service Domain 1",
				bianId: "BIAN_CR_D_API",
				attributes: [],
			},
		],
		serviceOperations: [
			{
				uid: "api_sd1_so1",
				name: "SO Epsilon Operation (API)",
				description: "Service Operation Epsilon API",
			},
		],
	},
	sd2_uid: {
		behaviourQualifiers: [{ uid: "api_sd2_bq1", name: "BQ X for SD2 (API)" }],
		businessScenarios: [],
		controlRecords: [
			{
				uid: "api_sd2_cr1",
				name: "CR Y for SD2 (API)",
				serviceDomainID: 2,
				serviceDomainName: "Service Domain 2",
				bianId: "BIAN_CR_Y_API",
				attributes: null,
				description: null,
			},
		],
		serviceOperations: [],
	},
	sd3_uid: {
		// Example for a service domain that might exist
		behaviourQualifiers: [],
		businessScenarios: [],
		controlRecords: [],
		serviceOperations: [
			{ uid: "api_sd3_so1", name: "SO Omega Operation (API)" },
		],
	},
};

export const fetchServiceDomainDetailsFromApi = async (
	serviceDomainUID: string
): Promise<RawServiceDomainDetails> => {
	console.log(
		`[Shared API Call] Fetching details for Service Domain: ${serviceDomainUID}`
	);

	// In a real application, this would be an actual fetch request:
	// try {
	//   const response = await fetch(`/api/servicedomains/${serviceDomainUID}/details`);
	//   if (!response.ok) {
	//     const errorText = await response.text();
	//     throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
	//   }
	//   const data: RawServiceDomainDetails = await response.json();
	//   return data;
	// } catch (error) {
	//   console.error(`Failed to fetch service domain details for ${serviceDomainUID}:`, error);
	//   throw error; // Re-throw to be caught by the caller
	// }

	// Using mock for demonstration:
	return new Promise((resolve) => {
		setTimeout(() => {
			const details = mockApiDataStore[serviceDomainUID];
			if (details) {
				resolve(details);
			} else {
				// If no specific mock data, resolve with empty arrays to simulate an empty but successful API response
				console.warn(
					`[Shared API Call] No mock data for ${serviceDomainUID}, returning empty details.`
				);
				resolve({
					behaviourQualifiers: [],
					businessScenarios: [],
					controlRecords: [],
					serviceOperations: [],
				});
			}
		}, 1000); // Simulate network delay
	});
};

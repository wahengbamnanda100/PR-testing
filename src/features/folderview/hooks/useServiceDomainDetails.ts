/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useServiceDomainDetails.ts
import { useState, useEffect, useCallback } from "react"; // Import useCallback
import axios, { AxiosError } from "axios";

// (ApiServiceDomainDetailResponse interface remains the same)
export interface ApiServiceDomainDetailResponse {
	displayName: string;
	examplesOfUse: string;
	executiveSummary: string;
	apiStatus: string;
	roleDefinition: string;
	status: string;
	uid: string;
	name: string;
}

// --- START: MODIFIED CODE ---

// 1. Add an options object for configuration
interface UseServiceDomainDetailsOptions {
	enabled?: boolean; // If true, the hook will fetch automatically. Defaults to true.
}

// 2. Update the return type to include the manual fetch function
interface UseServiceDomainDetailsReturn {
	data: ApiServiceDomainDetailResponse | null;
	loading: boolean;
	error: AxiosError | string | null;
	fetch: () => void; // The function to trigger a manual fetch
}

const useServiceDomainDetails = (
	serviceDomainUID: string | null | undefined,
	options: UseServiceDomainDetailsOptions = { enabled: true } // Default to enabled
): UseServiceDomainDetailsReturn => {
	const [data, setData] = useState<ApiServiceDomainDetailResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<AxiosError | string | null>(null);
	const { enabled } = options; // Destructure the enabled option

	// 3. Wrap the fetching logic in a useCallback to make it a stable function
	const fetchData = useCallback(async () => {
		if (!serviceDomainUID) {
			setData(null);
			setLoading(false);
			setError(null);
			return;
		}

		setLoading(true);
		setError(null);
		setData(null);
		try {
			const response = await axios.get<ApiServiceDomainDetailResponse>(
				`https://bian-modelapi-v4.azurewebsites.net/ServiceDomainByUID/${serviceDomainUID}`
			);
			setData(response.data);
		} catch (err: any) {
			if (axios.isAxiosError(err)) {
				console.error(
					"Axios error fetching service domain details:",
					err.response?.data || err.message
				);
				setError(err);
			} else {
				console.error("Unexpected error fetching service domain details:", err);
				setError("An unexpected error occurred");
			}
		} finally {
			setLoading(false);
		}
	}, [serviceDomainUID]); // Dependency is serviceDomainUID

	// 4. Modify the useEffect to respect the `enabled` flag
	useEffect(() => {
		if (enabled) {
			fetchData();
		}
	}, [serviceDomainUID, enabled, fetchData]); // Re-fetch if UID or enabled status changes

	// 5. Return the manual fetch function along with the other state
	return { data, loading, error, fetch: fetchData };
};

// --- END: MODIFIED CODE ---

export default useServiceDomainDetails;

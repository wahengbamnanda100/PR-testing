/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useServiceDomainDetails.ts
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

// Define the expected API response structure
// (you can make this more detailed based on the full response if needed elsewhere)
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

interface UseServiceDomainDetailsReturn {
	data: ApiServiceDomainDetailResponse | null;
	loading: boolean;
	error: AxiosError | string | null;
}

const useServiceDomainDetails = (
	serviceDomainUID: string | null | undefined
): UseServiceDomainDetailsReturn => {
	const [data, setData] = useState<ApiServiceDomainDetailResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<AxiosError | string | null>(null);

	useEffect(() => {
		if (!serviceDomainUID) {
			setData(null); // Clear data if UID is not provided or null
			setLoading(false);
			setError(null);
			return;
		}

		const fetchData = async () => {
			setLoading(true);
			setError(null);
			setData(null); // Clear previous data before new fetch
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
					console.error(
						"Unexpected error fetching service domain details:",
						err
					);
					setError("An unexpected error occurred");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [serviceDomainUID]); // Re-fetch if serviceDomainUID changes

	return { data, loading, error };
};

export default useServiceDomainDetails;

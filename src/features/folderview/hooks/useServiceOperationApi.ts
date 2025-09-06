/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useServiceOperations.ts
import { useState, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import { axiosInstanceModelApi } from "./api";

// Define the response type
export interface ServiceOperation {
	// Example properties - adjust based on the actual API response
	operationId: string;
	name: string;
	description: string;
	// ... other properties
}

interface UseServiceOperationsOptions {
	enabled?: boolean;
}

interface UseServiceOperationsReturn {
	data: ServiceOperation[] | null; // Assuming an array response
	loading: boolean;
	error: AxiosError | string | null;
	fetch: () => void;
}

const useServiceOperations = (
	bianId: string | null | undefined,
	options: UseServiceOperationsOptions = { enabled: true }
): UseServiceOperationsReturn => {
	const [data, setData] = useState<ServiceOperation[] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<AxiosError | string | null>(null);
	const { enabled } = options;

	const fetchData = useCallback(async () => {
		if (!bianId) {
			setData(null);
			return;
		}

		setLoading(true);
		setError(null);
		setData(null);
		try {
			const response = await axiosInstanceModelApi.get<ServiceOperation[]>(
				`/v2/ServiceOperationsByBianId/${bianId}`
			);
			setData(response.data || []);
		} catch (err: any) {
			setError(
				err instanceof Error ? err.message : "An unexpected error occurred"
			);
			console.error("Error fetching service operations:", err);
		} finally {
			setLoading(false);
		}
	}, [bianId]);

	useEffect(() => {
		if (enabled) {
			fetchData();
		}
	}, [bianId, enabled, fetchData]);

	return { data, loading, error, fetch: fetchData };
};

export default useServiceOperations;

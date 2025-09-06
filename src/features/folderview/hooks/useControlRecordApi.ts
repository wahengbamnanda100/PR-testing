/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useControlRecord.ts
import { useState, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import { axiosInstanceModelApi } from "./api"; // Assuming you have a pre-configured axios instance

// Define a more specific type for the response if you know the structure
export interface ControlRecord {
	// Example properties - adjust based on the actual API response
	uid: string;
	name: string;
	description: string;
	// ... other properties
}

interface UseControlRecordOptions {
	enabled?: boolean;
}

interface UseControlRecordReturn {
	data: ControlRecord[] | null; // Assuming the API returns an array
	loading: boolean;
	error: AxiosError | string | null;
	fetch: () => void;
}

const useControlRecord = (
	uid: string | null | undefined,
	options: UseControlRecordOptions = { enabled: true }
): UseControlRecordReturn => {
	const [data, setData] = useState<ControlRecord[] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<AxiosError | string | null>(null);
	const { enabled } = options;

	const fetchData = useCallback(async () => {
		if (!uid) {
			setData(null);
			return;
		}

		setLoading(true);
		setError(null);
		setData(null);
		try {
			const response = await axiosInstanceModelApi.get<ControlRecord[]>(
				`/v2/ControlRecordByUID/${uid}`
			);
			setData(response.data || []);
		} catch (err: any) {
			setError(
				err instanceof Error ? err.message : "An unexpected error occurred"
			);
			console.error("Error fetching control record:", err);
		} finally {
			setLoading(false);
		}
	}, [uid]);

	useEffect(() => {
		if (enabled) {
			fetchData();
		}
	}, [uid, enabled, fetchData]);

	return { data, loading, error, fetch: fetchData };
};

export default useControlRecord;

/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useBehaviourQualifiers.ts
import { useState, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import { axiosInstanceModelApi } from "./api";

// Define the response type
export interface BehaviourQualifier {
	// Example properties - adjust based on the actual API response
	uid: string;
	qualifierName: string;
	type: string;
	// ... other properties
}

interface UseBehaviourQualifiersOptions {
	enabled?: boolean;
}

interface UseBehaviourQualifiersReturn {
	data: BehaviourQualifier[] | null; // Assuming an array response
	loading: boolean;
	error: AxiosError | string | null;
	fetch: () => void;
}

const useBehaviourQualifiers = (
	uid: string | null | undefined,
	options: UseBehaviourQualifiersOptions = { enabled: true }
): UseBehaviourQualifiersReturn => {
	const [data, setData] = useState<BehaviourQualifier[] | null>(null);
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
			const response = await axiosInstanceModelApi.get<BehaviourQualifier[]>(
				`/v2/BehaviourQualifiersByUID/${uid}`
			);
			setData(response.data || []);
		} catch (err: any) {
			setError(
				err instanceof Error ? err.message : "An unexpected error occurred"
			);
			console.error("Error fetching behaviour qualifiers:", err);
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

export default useBehaviourQualifiers;

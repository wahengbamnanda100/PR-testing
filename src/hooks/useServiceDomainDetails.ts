import { useState, useEffect } from "react";
import {
	fetchServiceDomainDetailsFromApi,
	RawServiceDomainDetails,
} from "../api/serviceDomainApi";

const useServiceDomainDetails = (serviceDomainUID: string | null) => {
	const [data, setData] = useState<RawServiceDomainDetails | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!serviceDomainUID) {
			setData(null);
			setLoading(false);
			setError(null);
			return;
		}

		const loadData = async () => {
			setLoading(true);
			setError(null);
			try {
				const result = await fetchServiceDomainDetailsFromApi(serviceDomainUID);
				setData(result);
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("An unknown error occurred")
				);
				setData(null);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [serviceDomainUID]);

	return { data, loading, error };
};

export default useServiceDomainDetails;

import axios from "axios";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const axiosInstanceModelApi = axios.create({
	baseURL: "https://bian-modelapi-v4.azurewebsites.net/",
	headers: { "Content-Type": "application/json; charset=utf-8" },
});

export const serviceDomainApi = {
	getServiceDomainByUidLite: async (uid: string): Promise<any> => {
		const response = await axiosInstanceModelApi.get(
			`/v2/ServiceDomainByUID/${uid}`
		);
		return response.data;
	},

	getControlRecordByUID: async (uid: string): Promise<any> => {
		const response = await axiosInstanceModelApi.get(
			`/v2/ControlRecordByUID/${uid}`
		);
		// Assuming the data you need is in response.data.attributes
		return response.data || [];
	},

	getBehaviourQualifiersByUID: async (uid: string): Promise<any> => {
		const response = await axiosInstanceModelApi.get(
			`/v2/BehaviourQualifiersByUID/${uid}`
		);
		return response.data || [];
	},

	getServiceOperationsByBianId: async (bianId: string): Promise<any> => {
		const response = await axiosInstanceModelApi.get(
			`/v2/ServiceOperationsByBianId/${bianId}`
		);
		return response.data || [];
	},

	getBusinessScenarioByUIDLite: async (uid: string): Promise<any> => {
		const response = await axiosInstanceModelApi.get(
			`/BusinessScenarioByUIDLite/${uid}`
		);
		return response.data;
	},
	getBOTypes: async (type: string): Promise<any> => {
		const response = await axiosInstanceModelApi.get(
			`/v2/BusinessObjectTypes/${type}`
		);
		return response.data;
	},
};

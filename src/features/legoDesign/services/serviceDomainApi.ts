export interface ServiceDomainDetails {
  name: string;
  roleDefinition: string;
  keyFeatures: string[];
  exampleofuse: string;
  executiveSummary: string;
}

export interface ServiceDomainApiResponse {
  name: string;
  roleDefinition: string;
  keyFeatures: string[];
  exampleofuse: string;
  executiveSummary: string;
}

export const fetchServiceDomainDetails = async (uid: string): Promise<ServiceDomainDetails> => {
  try {
    const response = await fetch(`https://bian-modelapi-v4.azurewebsites.net/v2/ServiceDomainByUID/${uid}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ServiceDomainApiResponse = await response.json();
    
    return {
      name: data.name || 'Unknown Service Domain',
      roleDefinition: data.roleDefinition || 'No role definition available',
      keyFeatures: Array.isArray(data.keyFeatures) ? data.keyFeatures : [],
      exampleofuse: data.exampleofuse || 'No example of use available',
      executiveSummary: data.executiveSummary || 'No executive summary available'
    };
  } catch (error) {
    console.error('Error fetching service domain details:', error);
    throw error;
  }
};
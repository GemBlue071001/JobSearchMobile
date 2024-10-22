import httpClient from "../../httpClient/httpClient";
import { apiLinks } from "../mainService";


interface JobSearch{
    data: { [key: string]: string|number|undefined };
}

export const GetJobSearch = async ({ data }: JobSearch) => {
    try {
      const response = await httpClient.post({
        url: apiLinks.jobSearch.POST,
        data: data,
      });
      return response.data;
    } catch (error: unknown) {
  
      if (error instanceof Error) {
        console.error("Post JobActivity request failed:", error.message); 
      } else {
        console.error("Unexpected error", error);
      }
      throw error; 
    }
  };
  
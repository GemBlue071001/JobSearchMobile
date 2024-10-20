import httpClient from "../../httpClient/httpClient";
import { apiLinks } from "../mainService";

interface Comment {
  id: number;
  commentText: string;
  commentDate: string;
  rating: number;
}
interface SeekersByJobPost {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  cvId: number;
  cvPath: string;
  jobPostActivityId: number;
  status:string;
  jobPostActivityComments:Comment[]
}



interface signal {
  signal?: AbortSignal;
  id: number;
}

interface FetchError extends Error {
  code?: number;
  info?: Record<string, unknown>;
}

export const GetSeekerJobPost = async ({
  id,
  signal,
}: signal): Promise<{
  GetSeekers: SeekersByJobPost[];
}> => {
  try {
    const response = await httpClient.get({
      url: `${apiLinks.JobPosts.GetSeekerByJobPosts}/${id}/Seekers`,
      signal: signal,
    });

    if (response.status !== 200) {
      const error: FetchError = new Error(
        "An error occurred while fetching Seekfer Apply by JobPost"
      );
      error.code = response.status;
      error.info = response.data as Record<string, unknown>;
      throw error;
    }

    const Seeker = response.data;
    return {
      GetSeekers: Seeker.result as SeekersByJobPost[],
    };
  } catch (error) {
    console.error("Fetching Seekfer by JobPost failed", error);
    throw error;
  }
};

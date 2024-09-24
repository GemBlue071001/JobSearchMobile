import { Job } from "./Job";


export interface Company {
    id: number;
    name: string;
    overview: {
        title: string;
        description: string;
    };
    location: string;
    jobOpeningsCount: number;
    image: string; // URL for the company logo
    jobs: Job[]; // All jobs related to the company
}

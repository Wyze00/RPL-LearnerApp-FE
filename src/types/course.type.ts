import type { Video } from "./video.type";

export interface Course {
    id: string;
    title: string;
    description: string;
    instructor_id: string;
    preview_video_link: string;
    price: number;
}

export interface CourseIncludeVideo extends Course {
    videos: Video[];
}
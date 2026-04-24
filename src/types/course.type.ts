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

export interface EnrollCourse {
    paymentMethod: string;
}

export interface CourseIncludeCount extends Course {
    count: number;
}

export interface CoursePaymentHistory {
    id              : string;
    course_id       : string;
    learner_id      : string;
    createdAt       : string;
    payment_method  : string;
    amount          : number;
    status          : string;
}
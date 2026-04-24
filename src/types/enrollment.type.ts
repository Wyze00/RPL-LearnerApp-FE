import { type Course } from "./course.type";
import type { Video } from "./video.type";

export interface Enrollment {
    id: string,
    learner_id: string,
    course_id: string,
    course: Course,
    progress: number,
} 

export interface EnrollmentVideo {
  id: string;
  enroll_id: string;
  video_id: string;
  isCompleted: boolean;
  video: Video;
}

export interface EnrollmentWithVideo extends Enrollment {
    enrollmentVideos: EnrollmentVideo[]; 
}
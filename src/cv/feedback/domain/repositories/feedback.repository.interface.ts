import { Feedback } from '../entities/feedback.entity';

export const CV_FEEDBACK_REPOSITORY = Symbol('CV_FEEDBACK_REPOSITORY');
export interface ICvFeedbackRepository {
  save(feedback: Feedback): Promise<void>;
}

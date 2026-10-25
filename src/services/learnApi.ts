import { api } from './api';
import {
  TrainingProgramme,
  PoshRecord,
  SecurityTraining,
  BulkAssignResponse,
  CompletionTrackerResponse,
  AssignCoursePayload,
  AssignCourseResponse,
  CourseCategory,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  Skill,
  CreateSkillPayload,
  SkillsMatrixResponse,
  RateSkillPayload,
  EmployeeSkillRating,
  CompletionRecord,
  RecommendationsResponse,
  MyAssignment,
} from './types';

export async function getTrainingProgrammes(): Promise<TrainingProgramme[]> {
  const res = await api.get('/learn/programmes');
  return res.data;
}

export async function createTrainingProgramme(payload: Partial<TrainingProgramme>): Promise<TrainingProgramme> {
  const res = await api.post('/learn/programmes', payload);
  return res.data;
}

export async function updateTrainingProgramme(id: string, payload: Partial<TrainingProgramme>): Promise<TrainingProgramme> {
  const res = await api.put(`/learn/programmes/${id}`, payload);
  return res.data;
}

export async function deleteTrainingProgramme(id: string): Promise<{ success: boolean; id: string }> {
  const res = await api.delete(`/learn/programmes/${id}`);
  return res.data;
}

export async function getPoshRecords(): Promise<PoshRecord[]> {
  const res = await api.get('/learn/posh');
  return res.data;
}

export async function createPoshRecord(payload: Partial<PoshRecord>): Promise<PoshRecord> {
  const res = await api.post('/learn/posh', payload);
  return res.data;
}

export async function updatePoshRecord(id: string, payload: Partial<PoshRecord>): Promise<PoshRecord> {
  const res = await api.put(`/learn/posh/${id}`, payload);
  return res.data;
}

export async function deletePoshRecord(id: string): Promise<{ success: boolean; id: string }> {
  const res = await api.delete(`/learn/posh/${id}`);
  return res.data;
}

export async function getSecurityTrainings(): Promise<SecurityTraining[]> {
  const res = await api.get('/learn/sectrain');
  return res.data;
}

export async function createSecurityTraining(payload: Partial<SecurityTraining>): Promise<SecurityTraining> {
  const res = await api.post('/learn/sectrain', payload);
  return res.data;
}

export async function updateSecurityTraining(id: string, payload: Partial<SecurityTraining>): Promise<SecurityTraining> {
  const res = await api.put(`/learn/sectrain/${id}`, payload);
  return res.data;
}

export async function deleteSecurityTraining(id: string): Promise<{ success: boolean; id: string }> {
  const res = await api.delete(`/learn/sectrain/${id}`);
  return res.data;
}

export async function bulkAssignSecurityTraining(payload: { course: string; due: string }): Promise<BulkAssignResponse> {
  const res = await api.post('/learn/sectrain/bulk-assign', payload);
  return res.data;
}

export async function getCompletionTracker(): Promise<CompletionTrackerResponse> {
  const res = await api.get('/learn/completion');
  return res.data;
}

export async function updateAssignmentScore(assignmentId: string, score: number): Promise<MyAssignment> {
  const res = await api.put(`/learn/assignments/${assignmentId}/score`, { score });
  return res.data;
}

export async function assignCourse(courseId: string, payload: AssignCoursePayload): Promise<AssignCourseResponse> {
  const res = await api.post(`/learn/courses/${courseId}/assign`, payload);
  return res.data;
}

export async function getCategories(): Promise<CourseCategory[]> {
  const res = await api.get('/learn/categories');
  return res.data;
}

export async function createCategory(payload: CreateCategoryPayload): Promise<CourseCategory> {
  const res = await api.post('/learn/categories', payload);
  return res.data;
}

export async function updateCategory(id: string, payload: UpdateCategoryPayload): Promise<CourseCategory> {
  const res = await api.put(`/learn/categories/${id}`, payload);
  return res.data;
}

export async function deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
  const res = await api.delete(`/learn/categories/${id}`);
  return res.data;
}

export async function getSkills(): Promise<Skill[]> {
  const res = await api.get('/learn/skills');
  return res.data;
}

export async function createSkill(payload: CreateSkillPayload): Promise<Skill> {
  const res = await api.post('/learn/skills', payload);
  return res.data;
}

export async function getSkillsMatrix(): Promise<SkillsMatrixResponse> {
  const res = await api.get('/learn/skills/matrix');
  return res.data;
}

export async function rateSkill(payload: RateSkillPayload): Promise<EmployeeSkillRating> {
  const res = await api.post('/learn/skills/rate', payload);
  return res.data;
}

export async function getCompletionRecords(): Promise<CompletionRecord[]> {
  const res = await api.get('/learn/records');
  return res.data;
}

export async function getSkillRecommendations(): Promise<RecommendationsResponse> {
  const res = await api.get('/learn/recommendations');
  return res.data;
}

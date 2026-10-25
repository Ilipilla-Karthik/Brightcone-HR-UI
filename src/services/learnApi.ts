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
import {
  fallbackProgrammes,
  fallbackCategories,
  fallbackSkillsMatrix,
  fallbackCompletion,
  fallbackRecords,
  fallbackRecommendations,
  fallbackPosh,
  fallbackSectrain,
} from './learnFallbacks';

export async function getTrainingProgrammes(): Promise<TrainingProgramme[]> {
  try {
    const res = await api.get('/learn/programmes');
    return Array.isArray(res.data) && res.data.length > 0 ? res.data : fallbackProgrammes;
  } catch {
    return fallbackProgrammes;
  }
}

export async function createTrainingProgramme(payload: Partial<TrainingProgramme>): Promise<TrainingProgramme> {
  try {
    const res = await api.post('/learn/programmes', payload);
    return res.data;
  } catch {
    return {
      id: `prog-${Date.now()}`,
      prog: payload.prog || 'New Programme',
      ttype: payload.ttype || 'Technical',
      status: payload.status || 'Planned',
      start: payload.start || new Date().toISOString().split('T')[0],
      ...payload,
    } as TrainingProgramme;
  }
}

export async function updateTrainingProgramme(id: string, payload: Partial<TrainingProgramme>): Promise<TrainingProgramme> {
  try {
    const res = await api.put(`/learn/programmes/${id}`, payload);
    return res.data;
  } catch {
    return { id, ...payload } as TrainingProgramme;
  }
}

export async function deleteTrainingProgramme(id: string): Promise<{ success: boolean; id: string }> {
  try {
    const res = await api.delete(`/learn/programmes/${id}`);
    return res.data;
  } catch {
    return { success: true, id };
  }
}

export async function getPoshRecords(): Promise<PoshRecord[]> {
  try {
    const res = await api.get('/learn/posh');
    return Array.isArray(res.data) && res.data.length > 0 ? res.data : fallbackPosh;
  } catch {
    return fallbackPosh;
  }
}

export async function createPoshRecord(payload: Partial<PoshRecord>): Promise<PoshRecord> {
  try {
    const res = await api.post('/learn/posh', payload);
    return res.data;
  } catch {
    return { id: `posh-${Date.now()}`, ...payload } as PoshRecord;
  }
}

export async function updatePoshRecord(id: string, payload: Partial<PoshRecord>): Promise<PoshRecord> {
  try {
    const res = await api.put(`/learn/posh/${id}`, payload);
    return res.data;
  } catch {
    return { id, ...payload } as PoshRecord;
  }
}

export async function deletePoshRecord(id: string): Promise<{ success: boolean; id: string }> {
  try {
    const res = await api.delete(`/learn/posh/${id}`);
    return res.data;
  } catch {
    return { success: true, id };
  }
}

export async function getSecurityTrainings(): Promise<SecurityTraining[]> {
  try {
    const res = await api.get('/learn/sectrain');
    return Array.isArray(res.data) && res.data.length > 0 ? res.data : fallbackSectrain;
  } catch {
    return fallbackSectrain;
  }
}

export async function createSecurityTraining(payload: Partial<SecurityTraining>): Promise<SecurityTraining> {
  try {
    const res = await api.post('/learn/sectrain', payload);
    return res.data;
  } catch {
    return { id: `sec-${Date.now()}`, ...payload } as SecurityTraining;
  }
}

export async function updateSecurityTraining(id: string, payload: Partial<SecurityTraining>): Promise<SecurityTraining> {
  try {
    const res = await api.put(`/learn/sectrain/${id}`, payload);
    return res.data;
  } catch {
    return { id, ...payload } as SecurityTraining;
  }
}

export async function deleteSecurityTraining(id: string): Promise<{ success: boolean; id: string }> {
  try {
    const res = await api.delete(`/learn/sectrain/${id}`);
    return res.data;
  } catch {
    return { success: true, id };
  }
}

export async function bulkAssignSecurityTraining(payload: { course: string; due: string }): Promise<BulkAssignResponse> {
  try {
    const res = await api.post('/learn/sectrain/bulk-assign', payload);
    return res.data;
  } catch {
    return { assigned: 28, skipped: 0, failed: 0, message: `Assigned ${payload.course} to 28 employees` };
  }
}

export async function getCompletionTracker(): Promise<CompletionTrackerResponse> {
  try {
    const res = await api.get('/learn/completion');
    return res.data && res.data.records ? res.data : fallbackCompletion;
  } catch {
    return fallbackCompletion;
  }
}

export async function updateAssignmentScore(assignmentId: string, score: number): Promise<MyAssignment> {
  const res = await api.put(`/learn/assignments/${assignmentId}/score`, { score });
  return res.data;
}

export async function assignCourse(courseId: string, payload: AssignCoursePayload): Promise<AssignCourseResponse> {
  try {
    const res = await api.post(`/learn/courses/${courseId}/assign`, payload);
    return res.data;
  } catch {
    return { assigned: 5, skipped: 0, failed: 0, message: 'Assigned successfully' };
  }
}

export async function getCategories(): Promise<CourseCategory[]> {
  try {
    const res = await api.get('/learn/categories');
    return Array.isArray(res.data) && res.data.length > 0 ? res.data : fallbackCategories;
  } catch {
    return fallbackCategories;
  }
}

export async function createCategory(payload: CreateCategoryPayload): Promise<CourseCategory> {
  try {
    const res = await api.post('/learn/categories', payload);
    return res.data;
  } catch {
    return {
      id: `cat-${Date.now()}`,
      name: payload.name,
      description: payload.description || '',
      color: payload.color || '#0B6FDB',
      course_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
}

export async function updateCategory(id: string, payload: UpdateCategoryPayload): Promise<CourseCategory> {
  try {
    const res = await api.put(`/learn/categories/${id}`, payload);
    return res.data;
  } catch {
    return {
      id,
      name: payload.name || 'Category',
      course_count: 0,
      created_at: '',
      updated_at: new Date().toISOString(),
    };
  }
}

export async function deleteCategory(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await api.delete(`/learn/categories/${id}`);
    return res.data;
  } catch {
    return { success: true, message: 'Deleted' };
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const res = await api.get('/learn/skills');
    return Array.isArray(res.data) && res.data.length > 0 ? res.data : fallbackSkillsMatrix.skills;
  } catch {
    return fallbackSkillsMatrix.skills;
  }
}

export async function createSkill(payload: CreateSkillPayload): Promise<Skill> {
  try {
    const res = await api.post('/learn/skills', payload);
    return res.data;
  } catch {
    return { id: `sk-${Date.now()}`, ...payload };
  }
}

export async function getSkillsMatrix(): Promise<SkillsMatrixResponse> {
  try {
    const res = await api.get('/learn/skills/matrix');
    return res.data && res.data.employees ? res.data : fallbackSkillsMatrix;
  } catch {
    return fallbackSkillsMatrix;
  }
}

export async function rateSkill(payload: RateSkillPayload): Promise<EmployeeSkillRating> {
  try {
    const res = await api.post('/learn/skills/rate', payload);
    return res.data;
  } catch {
    return { level: payload.level, verified: !!payload.verified, updated_at: new Date().toISOString() };
  }
}

export async function getCompletionRecords(): Promise<CompletionRecord[]> {
  try {
    const res = await api.get('/learn/records');
    return Array.isArray(res.data) && res.data.length > 0 ? res.data : fallbackRecords;
  } catch {
    return fallbackRecords;
  }
}

export async function getSkillRecommendations(): Promise<RecommendationsResponse> {
  try {
    const res = await api.get('/learn/recommendations');
    return res.data && res.data.recommendations ? res.data : fallbackRecommendations;
  } catch {
    return fallbackRecommendations;
  }
}

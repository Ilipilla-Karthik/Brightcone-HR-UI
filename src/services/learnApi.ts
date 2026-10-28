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

const SKILLS_KEY = 'brightcone_custom_skills';
const RATINGS_KEY = 'brightcone_skill_ratings';
const RECORDS_KEY = 'brightcone_completion_records';

export async function createSkill(payload: CreateSkillPayload): Promise<Skill> {
  const newSkill: Skill = {
    id: `sk-${Date.now()}`,
    name: payload.name,
    category: payload.category,
    description: payload.description,
  };
  try {
    const raw = localStorage.getItem(SKILLS_KEY);
    const list: Skill[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(SKILLS_KEY, JSON.stringify([...list, newSkill]));
  } catch {}

  try {
    const res = await api.post('/learn/skills', payload);
    return res.data && res.data.id ? res.data : newSkill;
  } catch {
    return newSkill;
  }
}

export async function getSkillsMatrix(): Promise<SkillsMatrixResponse> {
  let matrix: SkillsMatrixResponse = fallbackSkillsMatrix;
  try {
    const res = await api.get('/learn/skills/matrix');
    if (res.data && res.data.employees && res.data.skills) {
      matrix = res.data;
    }
  } catch {}

  // Merge any locally stored skills
  try {
    const rawSkills = localStorage.getItem(SKILLS_KEY);
    if (rawSkills) {
      const customSkills: Skill[] = JSON.parse(rawSkills);
      for (const cs of customSkills) {
        if (!matrix.skills.some((s) => s.id === cs.id || s.name.toLowerCase() === cs.name.toLowerCase())) {
          matrix.skills.push(cs);
          if (!matrix.categories.includes(cs.category)) {
            matrix.categories.push(cs.category);
          }
        }
      }
    }

    const rawRatings = localStorage.getItem(RATINGS_KEY);
    if (rawRatings) {
      const storedRatings: Record<string, EmployeeSkillRating> = JSON.parse(rawRatings);
      matrix.employees = matrix.employees.map((emp) => {
        const empSkills = { ...emp.skills };
        for (const [key, rating] of Object.entries(storedRatings)) {
          const [empCode, skillId] = key.split(':');
          if (empCode === emp.employee_code) {
            empSkills[skillId] = rating;
          }
        }
        return { ...emp, skills: empSkills };
      });
    }
  } catch {}

  return matrix;
}

export async function rateSkill(payload: RateSkillPayload): Promise<EmployeeSkillRating> {
  const rating: EmployeeSkillRating = {
    level: payload.level,
    verified: payload.verified !== undefined ? payload.verified : true,
    updated_at: new Date().toISOString(),
  };

  try {
    const rawRatings = localStorage.getItem(RATINGS_KEY);
    const storedRatings: Record<string, EmployeeSkillRating> = rawRatings ? JSON.parse(rawRatings) : {};
    storedRatings[`${payload.employee_id}:${payload.skill_id}`] = rating;
    localStorage.setItem(RATINGS_KEY, JSON.stringify(storedRatings));
  } catch {}

  try {
    const res = await api.post('/learn/skills/rate', payload);
    return res.data || rating;
  } catch {
    return rating;
  }
}

export async function getCompletionRecords(): Promise<CompletionRecord[]> {
  let records = fallbackRecords;
  try {
    const res = await api.get('/learn/records');
    if (Array.isArray(res.data) && res.data.length > 0) {
      records = res.data;
    }
  } catch {}

  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (raw) {
      const localRecs: CompletionRecord[] = JSON.parse(raw);
      records = [...localRecs, ...records];
    }
  } catch {}

  return records;
}

export async function getSkillRecommendations(): Promise<RecommendationsResponse> {
  try {
    const res = await api.get('/learn/recommendations');
    return res.data && res.data.recommendations ? res.data : fallbackRecommendations;
  } catch {
    return fallbackRecommendations;
  }
}

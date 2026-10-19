const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('keeplearning_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('keeplearning_token', token);
    } else {
      localStorage.removeItem('keeplearning_token');
    }
  }

  clearToken() {
    localStorage.removeItem('keeplearning_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        // If unauthorized, clear invalid token
        this.clearToken();
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg = data?.detail || `Request failed with status ${response.status}`;
        const error = new Error(errorMsg);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.status) throw err;
      // Network or connection failure
      const netError = new Error('Could not connect to keepLearning server. Please verify the backend is running.');
      netError.status = 503;
      throw netError;
    }
  }

  // Auth Endpoints
  async register(fullName, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ full_name: fullName, email, password }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe() {
    return this.request('/auth/me', {
      method: 'GET',
    });
  }

  // Dashboard & Analytics
  async getDashboard() {
    return this.request('/dashboard', {
      method: 'GET',
    });
  }

  async getAnalytics() {
    return this.request('/analytics', {
      method: 'GET',
    });
  }

  // Subjects & Topics
  async getSubjects() {
    return this.request('/subjects', {
      method: 'GET',
    });
  }

  async getSubjectDetails(subjectId) {
    return this.request(`/subjects/${subjectId}`, {
      method: 'GET',
    });
  }

  async getTopics() {
    return this.request('/topics', {
      method: 'GET',
    });
  }

  async getTopicDetails(topicId) {
    return this.request(`/topics/${topicId}`, {
      method: 'GET',
    });
  }

  async getTopicForecast(topicId) {
    return this.request(`/topics/${topicId}/forecast`, {
      method: 'GET',
    });
  }

  // Quizzes
  async getQuiz(topicId) {
    return this.request(`/quizzes/${topicId}`, {
      method: 'GET',
    });
  }

  async submitQuiz(topicId, answers) {
    return this.request(`/quizzes/${topicId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  async getQuizHistory() {
    return this.request('/quizzes/history/me', {
      method: 'GET',
    });
  }

  // Revision Plan
  async getRevisionPlan() {
    return this.request('/revision-plan', {
      method: 'GET',
    });
  }

  async addRevisionTask(topicId, dueDateCategory = 'Today', reason = 'Added by student') {
    return this.request('/revision-plan/add', {
      method: 'POST',
      body: JSON.stringify({ topicId, dueDateCategory, reason }),
    });
  }

  async completeRevisionTask(taskId) {
    return this.request(`/revision-plan/${taskId}/complete`, {
      method: 'POST',
    });
  }

  async rescheduleTask(taskId, dueDateCategory) {
    return this.request(`/revision-plan/${taskId}/reschedule`, {
      method: 'POST',
      body: JSON.stringify({ dueDateCategory }),
    });
  }

  // Profile & Settings
  async getProfile() {
    return this.request('/profile', {
      method: 'GET',
    });
  }

  async updateProfile(profileData) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async submitOnboarding(onboardingData) {
    return this.request('/profile/onboarding', {
      method: 'POST',
      body: JSON.stringify(onboardingData),
    });
  }
}

export const apiClient = new ApiClient();

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

const mapCourse = (course) => ({
  ...course,
  courseName: course.courseName || course.course_name || '',
  enrolled: Number(course.enrolled ?? course.enrolled_count ?? course.enrolledCount ?? course.students?.length ?? 0) || 0,
  instructor: course.instructor || '',
  category: course.category || 'General',
  level: course.level || 'Beginner',
  duration: course.duration || '12 weeks',
  description: course.description || '',
  imageUrl: course.imageUrl || course.image_url || '',
  publishedBy: course.publishedBy || course.published_by || 'LMS Academy',
  badge: course.badge || 'Popular',
  rating: Number(course.rating ?? 4.5),
  ratingCount: Number(course.ratingCount ?? course.rating_count ?? 1000),
  priceInr: Number(course.priceInr ?? course.price_inr ?? 499),
  listPriceInr: Number(course.listPriceInr ?? course.list_price_inr ?? 2999),
  isEnrolled: Boolean(course.isEnrolled ?? course.is_enrolled ?? false),
});

const mapStudent = (student) => ({
  ...student,
  email: student.email || '',
  grade: student.grade || 'N/A',
  joinDate: student.joinDate || '',
  courses: student.courses || [],
  courseIds: (student.courses || []).map((c) => c.id),
});

export const courseService = {
  getAll: async () => {
    const { data } = await api.get('/courses');
    return data.map(mapCourse);
  },

  getById: async (id) => {
    const all = await courseService.getAll();
    return all.find((c) => c.id === Number(id)) || null;
  },

  add: async (course) => {
    const payload = {
      courseName: course.courseName,
      instructor: course.instructor || '',
      category: course.category || 'General',
      level: course.level || 'Beginner',
      duration: course.duration || '12 weeks',
      imageUrl: course.imageUrl || '',
      publishedBy: course.publishedBy || 'LMS Academy',
      badge: course.badge || 'Popular',
      rating: Number(course.rating ?? 4.5),
      ratingCount: Number(course.ratingCount ?? 1000),
      priceInr: Number(course.priceInr ?? 499),
      listPriceInr: Number(course.listPriceInr ?? 2999),
      description: course.description || '',
    };
    const { data } = await api.post('/courses', payload);
    return mapCourse(data);
  },

  update: async (id, updated) => {
    const payload = {
      courseName: updated.courseName,
      instructor: updated.instructor || '',
      category: updated.category || 'General',
      level: updated.level || 'Beginner',
      duration: updated.duration || '12 weeks',
      imageUrl: updated.imageUrl || '',
      publishedBy: updated.publishedBy || 'LMS Academy',
      badge: updated.badge || 'Popular',
      rating: Number(updated.rating ?? 4.5),
      ratingCount: Number(updated.ratingCount ?? 1000),
      priceInr: Number(updated.priceInr ?? 499),
      listPriceInr: Number(updated.listPriceInr ?? 2999),
      description: updated.description || '',
    };
    const { data } = await api.put(`/courses/${id}`, payload);
    return mapCourse(data);
  },

  delete: async (id) => {
    await api.delete(`/courses/${id}`);
  },

  getStudents: async (courseId) => {
    const students = await studentService.getAll();
    return students.filter((s) => (s.courseIds || []).includes(Number(courseId)));
  },
};

export const studentService = {
  getAll: async () => {
    const { data } = await api.get('/students');
    return data.map(mapStudent);
  },

  getById: async (id) => {
    const all = await studentService.getAll();
    return all.find((s) => s.id === Number(id)) || null;
  },

  add: async (student, courseIds = []) => {
    const payload = {
      studentName: student.studentName,
      email: student.email || '',
      grade: student.grade || 'N/A',
      courseIds: courseIds.map(Number),
    };
    const { data } = await api.post('/students', payload);
    return mapStudent(data);
  },

  update: async (id, student, courseIds = []) => {
    const existing = await studentService.getById(id);
    const payload = {
      studentName: student.studentName,
      email: student.email || '',
      grade: student.grade || 'N/A',
      joinDate: existing?.joinDate || '',
      courseIds: courseIds.map(Number),
    };
    const { data } = await api.put(`/students/${id}`, payload);
    return mapStudent(data);
  },

  delete: async (id) => {
    await api.delete(`/students/${id}`);
  },
};

export const getStats = async () => {
  const [courses, students] = await Promise.all([
    courseService.getAll(),
    studentService.getAll(),
  ]);
  const totalEnrollments = students.reduce((sum, s) => sum + (s.courseIds || []).length, 0);
  return {
    totalCourses: courses.length,
    totalStudents: students.length,
    totalEnrollments,
    avgCoursesPerStudent: students.length > 0 ? (totalEnrollments / students.length).toFixed(1) : 0,
    recentStudents: students.slice(-5).reverse(),
  };
};

export const learningService = {
  getCatalog: async (username) => {
    const { data } = await api.get('/learning/catalog', { params: { username } });
    return {
      courses: (data.courses || []).map(mapCourse),
      categories: ['All', ...(data.categories || [])],
    };
  },

  enrollCourse: async (username, courseId) => {
    const { data } = await api.post('/learning/enroll', { username, courseId: Number(courseId) });
    return data;
  },

  unenrollCourse: async (username, courseId) => {
    const { data } = await api.post('/learning/unenroll', { username, courseId: Number(courseId) });
    return data;
  },

  getCoursesProgress: async (username) => {
    const { data } = await api.get('/learning/courses-progress', { params: { username } });
    return (data || []).map(mapCourse).map((c) => ({
      ...c,
      modulesCount: Number(c.modules_count ?? c.modulesCount ?? 0),
      activitiesCount: Number(c.activities_count ?? c.activitiesCount ?? 0),
      completedActivities: Number(c.completed_activities ?? c.completedActivities ?? 0),
      progress: Number(c.progress ?? 0),
      status: c.status || 'not-started',
    }));
  },

  getCourseModules: async (courseId) => {
    const { data } = await api.get(`/learning/courses/${courseId}/modules`);
    return data || [];
  },

  getUserGrades: async (username) => {
    const { data } = await api.get('/learning/user/grades', { params: { username } });
    return data;
  },

  getUserCertificates: async (username) => {
    const { data } = await api.get('/learning/user/certificates', { params: { username } });
    return data;
  },

  getHelp: async () => {
    const { data } = await api.get('/learning/help');
    return data;
  },

  getAnalytics: async () => {
    const { data } = await api.get('/learning/analytics');
    return data;
  },

  getNotifications: async (username) => {
    const { data } = await api.get('/learning/notifications', { params: { username } });
    return data || [];
  },
};

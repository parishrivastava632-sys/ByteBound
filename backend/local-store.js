const fs = require('fs');
const path = require('path');

function resolveStorePath(filePath) {
  return filePath || path.join(__dirname, 'data', 'local-projects.json');
}

function ensureDirectory(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadProjects(filePath) {
  const targetPath = resolveStorePath(filePath);
  if (!fs.existsSync(targetPath)) {
    return [];
  }

  try {
    const raw = fs.readFileSync(targetPath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('⚠️ [Local Store] Failed to parse saved projects, resetting cache:', error.message);
    return [];
  }
}

function saveProjects(projects, filePath) {
  const targetPath = resolveStorePath(filePath);
  ensureDirectory(targetPath);
  fs.writeFileSync(targetPath, JSON.stringify(projects, null, 2), 'utf8');
  return projects;
}

function upsertProject(project, filePath) {
  const current = loadProjects(filePath);
  const next = [project, ...current.filter((entry) => entry.id !== project.id)];
  return saveProjects(next, filePath);
}

function deleteProject(projectId, filePath) {
  const current = loadProjects(filePath);
  const next = current.filter((entry) => entry.id !== projectId);
  return saveProjects(next, filePath);
}

module.exports = {
  loadProjects,
  saveProjects,
  upsertProject,
  deleteProject,
};

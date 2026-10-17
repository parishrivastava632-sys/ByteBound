const STUDIO_STATE_KEY = 'omnimedia-studio-state';
const PROJECTS_KEY = 'omnimedia-studio-projects';

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readJSON(key, fallback) {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`⚠️ [Local Storage] Failed to read ${key}:`, error.message);
    return fallback;
  }
}

function writeJSON(key, value) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`⚠️ [Local Storage] Failed to write ${key}:`, error.message);
  }
}

export function loadStudioPreferences() {
  return readJSON(STUDIO_STATE_KEY, {
    content: '',
    targetAudience: 'Tech Enthusiasts, Creators, Founders',
    platformFocus: 'Omnichannel',
    generatedData: null,
  });
}

export function saveStudioPreferences(state) {
  writeJSON(STUDIO_STATE_KEY, state);
}

export function loadSavedProjects() {
  return readJSON(PROJECTS_KEY, []);
}

export function saveSavedProjects(projects) {
  writeJSON(PROJECTS_KEY, Array.isArray(projects) ? projects : []);
}

const test = require('node:test');
const assert = require('node:assert/strict');
const { loadProjects, saveProjects, upsertProject, deleteProject } = require('./local-store');

const tempDir = require('node:path').join(__dirname, '.tmp-local-store-test');
const tempFile = require('node:path').join(tempDir, 'projects.json');

test('loadProjects returns an empty list when the file does not exist', () => {
  const result = loadProjects(tempFile);
  assert.deepEqual(result, []);
});

test('saveProjects and upsertProject persist project records', () => {
  saveProjects([], tempFile);
  const project = {
    id: 'proj_1',
    userId: 'demo-user',
    rawInput: 'hello world',
    targetAudience: 'founders',
    platformFocus: 'Omnichannel',
    output: { productionSummary: { title: 'Demo' } },
    createdAt: new Date().toISOString(),
  };

  const updated = upsertProject(project, tempFile);
  assert.equal(updated.length, 1);
  assert.equal(updated[0].id, 'proj_1');

  const reloaded = loadProjects(tempFile);
  assert.equal(reloaded.length, 1);
  assert.equal(reloaded[0].userId, 'demo-user');
});

test('deleteProject removes the matching record', () => {
  const stored = [
    { id: 'a', userId: 'u1' },
    { id: 'b', userId: 'u1' },
  ];
  saveProjects(stored, tempFile);
  const result = deleteProject('a', tempFile);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'b');
});

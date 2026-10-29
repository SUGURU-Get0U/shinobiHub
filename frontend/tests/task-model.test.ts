import assert from 'node:assert/strict';
import { test } from 'node:test';
import { exampleTasks, localDateInput, needsReview, newTask, validateTask } from '../src/tasks.ts';

test('new cards need a title and a valid deadline', () => {
  const task = newTask();
  assert.ok(validateTask(task));
  task.title = 'Fictional check';
  assert.ok(validateTask(task));
  task.deadline = 'not a date';
  assert.ok(validateTask(task));
  task.deadline = new Date().toISOString();
  assert.equal(validateTask(task), '');
});

test('overdue reviews respect progress without changing feelings', () => {
  const task = exampleTasks()[0];
  const now = Date.parse(task.deadline) + 1;
  assert.equal(needsReview(task, now), true);
  task.feeling = "I'm procrastinating";
  task.progress = 'Done';
  assert.equal(needsReview(task, now), false);
  assert.equal(task.feeling, "I'm procrastinating");
  task.progress = 'In progress';
  task.deadline = new Date(now + 60000).toISOString();
  assert.equal(needsReview(task, now), false);
});

test('local date input represents the same minute as its ISO timestamp', () => {
  const iso = '2026-10-28T15:30:00.000Z';
  assert.equal(new Date(localDateInput(iso)).getTime(), Date.parse(iso));
  assert.equal(localDateInput(''), '');
});

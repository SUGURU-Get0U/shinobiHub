export const progresses = [
  "To do",
  "In progress",
  "Blocked",
  "Waiting on someone",
  "Done",
] as const;
export const feelings = [
  "No label",
  "I'm procrastinating",
  "I don't want to do it",
] as const;

// A type describes the fields every saved card must contain.
export type Task = {
  id: string;
  title: string;
  description: string;
  reference: string;
  progress: (typeof progresses)[number];
  feeling: (typeof feelings)[number];
  priority: string;
  bucket: string;
  deadline: string;
  waitingOn: string;
  dependency: string;
  color: string;
  size: "Compact" | "Comfortable";
};

export function newTask(): Task {
  return {
    id: globalThis.crypto.randomUUID(),
    title: "",
    description: "",
    reference: "",
    progress: "To do",
    feeling: "No label",
    priority: "Medium",
    bucket: "Today",
    deadline: "",
    waitingOn: "",
    dependency: "",
    color: "#a980ff",
    size: "Comfortable",
  };
}

export function validateTask(task: Task): string {
  if (!task.title.trim()) return "Give your card a title.";
  if (!task.deadline || !Number.isFinite(Date.parse(task.deadline)))
    return "Choose a valid review date and time.";
  return "";
}

export function needsReview(task: Task, now: number): boolean {
  return task.progress !== "Done" && Date.parse(task.deadline) <= now;
}

export function localDateInput(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export function exampleTasks(): Task[] {
  const base = newTask();
  return [
    {
      ...base,
      id: "demo-1",
      title: "Check the training servers",
      reference: "DEMO-013",
      description:
        "Fictional task: verify that the training environment is ready.",
      progress: "In progress",
      deadline: new Date(Date.now() - 600000).toISOString(),
    },
    {
      ...base,
      id: "demo-2",
      title: "Plan the network recovery",
      reference: "DEMO-090",
      description:
        "Fictional incident exercise. Outline the next recovery steps.",
      progress: "Waiting on someone",
      feeling: "I don't want to do it",
      priority: "High",
      waitingOn: "Training team",
      dependency: "Waiting for a fictional recovery plan.",
      deadline: new Date(Date.now() + 86400000).toISOString(),
      color: "#e9c779",
      bucket: "Tomorrow",
    },
  ];
}

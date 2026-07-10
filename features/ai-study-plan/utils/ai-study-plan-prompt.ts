import type { GenerateStudyPlanInput } from "@/features/ai-study-plan/schemas/ai-study-plan-schema";

type CreateStudyPlanPromptParams = {
  subjectName: string;
  input: GenerateStudyPlanInput;
};

export function createStudyPlanPrompt({ subjectName, input }: CreateStudyPlanPromptParams) {
  return `
You are an expert study planner.

Create a structured study plan for the following learning target.

Subject:
${subjectName}

Goal:
${input.goal}

Difficulty:
${input.difficulty}

Deadline:
${input.deadlineDays} days

Available time:
${input.availableHoursPerDay} hours per day

Additional notes:
${input.additionalNotes || "-"}

Is coding related:
${input.isCodingRelated ? "Yes" : "No"}

Return ONLY valid JSON with this exact structure:
{
  "title": "string",
  "description": "string or null",
  "goal": "string",
  "priority": "LOW | MEDIUM | HIGH | URGENT",
  "estimatedHours": number or null,
  "tasks": [
    {
      "title": "string",
      "description": "string or null",
      "priority": "LOW | MEDIUM | HIGH | URGENT",
      "position": number
    }
  ]
}

Rules:
- Generate 5 to 12 tasks.
- Make tasks practical and sequential.
- Use concise task titles.
- Keep descriptions short.
- Match the difficulty level.
- Match the deadline and available time.
- If coding related, make tasks implementation-oriented.
- If not coding related, make tasks learning-oriented.
- Do not include markdown.
- Do not include explanation outside JSON.
- Do not wrap JSON in triple backticks.
`;
}

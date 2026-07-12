import { BarChart3, CalendarCheck, ListTodo, Sparkles, Target, Timer } from "lucide-react";

import type { LandingProductFeature } from "@/features/landing/types/landing";

export const landingFeatures = [
  {
    title: "Smart Study Plans",
    description:
      "Create structured learning plans with clear goals, deadlines, and progress tracking.",
    icon: CalendarCheck,
    feature: "study-plans" as LandingProductFeature,
    accent: "indigo" as const,
  },
  {
    title: "Task Management",
    description: "Break large learning goals into smaller tasks and track every step clearly.",
    icon: ListTodo,
    feature: "tasks" as LandingProductFeature,
    accent: "cyan" as const,
  },
  {
    title: "Study Session Tracking",
    description: "Record your learning duration, notes, mood, and daily study activity.",
    icon: Timer,
    feature: "calendar" as LandingProductFeature,
    accent: "violet" as const,
  },
  {
    title: "Progress Analytics",
    description: "Understand your learning habits through progress charts and useful insights.",
    icon: BarChart3,
    feature: "analytics" as LandingProductFeature,
    accent: "indigo" as const,
  },
  {
    title: "Deadline Calendar",
    description: "See all your deadlines and study plans in one organized calendar view.",
    icon: Target,
    feature: "calendar" as LandingProductFeature,
    accent: "slate" as const,
  },
  {
    title: "AI Study Plan Generator",
    description: "Generate personalized study plans instantly with AI assistance.",
    icon: Sparkles,
    feature: "ai-generator" as LandingProductFeature,
    accent: "violet" as const,
  },
];

export const landingProductFeatures: {
  id: LandingProductFeature;
  title: string;
  description: string;
  benefits: string[];
}[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Get a complete overview of your learning journey at a glance.",
    benefits: [
      "Real-time study statistics and trends",
      "Recent activity and upcoming deadlines",
      "Active study plan progress tracking",
    ],
  },
  {
    id: "study-plans",
    title: "Study Plans",
    description: "Design detailed study plans with goals, priorities, and deadlines.",
    benefits: [
      "Set learning goals and track completion",
      "Organize by subject and priority level",
      "Monitor progress with visual indicators",
    ],
  },
  {
    id: "tasks",
    title: "Tasks",
    description: "Break down plans into actionable tasks with clear status tracking.",
    benefits: [
      "Create and organize tasks by study plan",
      "Track status from todo to done",
      "Set due dates and priorities",
    ],
  },
  {
    id: "calendar",
    title: "Calendar",
    description: "Visualize all your deadlines and study schedules in one place.",
    benefits: [
      "See task deadlines and plan end dates",
      "Group events by overdue, today, and upcoming",
      "Stay ahead with clear timeline views",
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Understand your study patterns with detailed analytics and charts.",
    benefits: [
      "Weekly study hours breakdown",
      "Task completion and subject distribution",
      "Track improvement over time",
    ],
  },
  {
    id: "ai-generator",
    title: "AI Generator",
    description: "Let AI create a complete study plan tailored to your goals.",
    benefits: [
      "Generate plans with natural language prompts",
      "Auto-create tasks with estimated durations",
      "Customize difficulty and learning pace",
    ],
  },
];

export const landingWorkflowSteps = [
  {
    step: 1,
    title: "Create a Subject",
    description: "Add subjects like Next.js, Laravel, or English to organize your learning.",
    detail: "Each subject can have its own color, target hours, and description.",
  },
  {
    step: 2,
    title: "Build a Study Plan",
    description: "Set your goal, deadline, priority, and estimated study hours.",
    detail: "Define what success looks like and when you want to achieve it.",
  },
  {
    step: 3,
    title: "Break It into Tasks",
    description: "Create actionable tasks with due dates and priority levels.",
    detail: "Small steps make large goals feel achievable and trackable.",
  },
  {
    step: 4,
    title: "Track Study Sessions",
    description: "Record focused sessions with duration, notes, and mood.",
    detail: "Build a habit of consistent daily learning.",
  },
  {
    step: 5,
    title: "Review Your Progress",
    description: "Check analytics, complete tasks, and adjust your plan as needed.",
    detail: "Understand what works and refine your approach over time.",
  },
];

export const landingTrustItems = [
  { label: "Study Plans", icon: CalendarCheck },
  { label: "Task Tracking", icon: ListTodo },
  { label: "Session History", icon: Timer },
  { label: "Progress Analytics", icon: BarChart3 },
  { label: "AI Assistance", icon: Sparkles },
];

export const landingFooterGroups = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Analytics", href: "#analytics" },
      { label: "Testimonials", href: "#testimonials" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
  {
    title: "Project",
    links: [{ label: "GitHub Repository", href: "https://github.com", external: true }],
  },
];

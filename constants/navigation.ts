import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  Home,
  LayoutDashboard,
  Settings,
  Sparkles,
  Timer,
} from "lucide-react";

export const marketingNavItems = [
  { label: "Features", href: "#features" },
  { label: "Product", href: "#product" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Analytics", href: "#analytics" },
  { label: "Testimonials", href: "#testimonials" },
];

export const dashboardNavigationGroups = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
      { label: "Study Plans", href: "/dashboard/plans", icon: CalendarDays },
      { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
      { label: "Study Sessions", href: "/dashboard/sessions", icon: Timer },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { label: "AI Generator", href: "/dashboard/ai", icon: Sparkles },
    ],
  },
  {
    label: "Account",
    items: [{ label: "Settings", href: "/dashboard/settings", icon: Settings }],
  },
];

export const dashboardNavItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
  { label: "Study Plans", href: "/dashboard/plans", icon: CalendarDays },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "Sessions", href: "/dashboard/sessions", icon: Timer },
  { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "AI Generator", href: "/dashboard/ai", icon: Sparkles },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const mobileDashboardNavItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Plans", href: "/dashboard/plans", icon: CalendarDays },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "Stats", href: "/dashboard/analytics", icon: BarChart3 },
];

import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  Home,
  LayoutDashboard,
  Settings,
  Timer,
} from "lucide-react";

export const marketingNavItems = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "How It Works",
    href: "#how-it-works",
  },
  {
    label: "Analytics",
    href: "#analytics",
  },
  {
    label: "Testimonials",
    href: "#testimonials",
  },
];

export const dashboardNavItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Subjects",
    href: "/dashboard/subjects",
    icon: BookOpen,
  },
  {
    label: "Study Plans",
    href: "/dashboard/plans",
    icon: CalendarDays,
  },
  {
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    label: "Sessions",
    href: "/dashboard/sessions",
    icon: Timer,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export const mobileDashboardNavItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Plans",
    href: "/dashboard/plans",
    icon: CalendarDays,
  },
  {
    label: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    label: "Stats",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
];

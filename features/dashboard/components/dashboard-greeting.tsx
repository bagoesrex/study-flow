type DashboardGreetingProps = {
  name?: string | null;
};

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";

  return "Good evening";
}

function getContextMessage(): string {
  const hour = new Date().getHours();

  if (hour < 12) return "Start your day with focus.";
  if (hour < 17) return "Keep the momentum going.";

  return "Wrap up your learning for today.";
}

function getFormattedDate(): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export function DashboardGreeting({ name }: DashboardGreetingProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
        {getGreeting()}
        {name ? `, ${name}` : ""}.
      </h1>
      <p className="mt-1 text-sm text-slate-500">{getContextMessage()}</p>
      <p className="mt-0.5 text-xs text-slate-400">{getFormattedDate()}</p>
    </div>
  );
}

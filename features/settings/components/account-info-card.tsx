import { UserCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { CurrentUserProfile } from "@/types/settings";

type AccountInfoCardProps = {
  user: CurrentUserProfile;
};

export function AccountInfoCard({ user }: AccountInfoCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-slate-100 text-slate-600">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            <UserCircle className="h-7 w-7" />
          )}
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-semibold tracking-tight text-slate-950">
              {user.name}
            </h2>
            <Badge variant="info">{user.role}</Badge>
          </div>

          <p className="text-sm text-slate-500">{user.email}</p>

          <p className="mt-4 text-xs text-slate-400">
            Account created at{" "}
            {new Intl.DateTimeFormat("id-ID", {
              dateStyle: "medium",
            }).format(user.createdAt)}
          </p>
        </div>
      </div>
    </Card>
  );
}

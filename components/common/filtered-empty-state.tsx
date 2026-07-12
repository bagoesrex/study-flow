import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";

type FilteredEmptyStateProps = {
  title?: string;
  description?: string;
  onReset: () => void;
};

export function FilteredEmptyState({
  title = "No matching data",
  description = "Tidak ada data yang sesuai dengan search atau filter saat ini.",
  onReset,
}: FilteredEmptyStateProps) {
  return (
    <EmptyState
      icon={SearchX}
      title={title}
      description={description}
      action={
        <Button type="button" variant="outline" onClick={onReset}>
          Reset Filters
        </Button>
      }
    />
  );
}

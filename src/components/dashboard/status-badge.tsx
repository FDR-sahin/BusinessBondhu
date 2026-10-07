import { Badge } from "@/components/ui/badge";
import { POST_STATUS } from "@/lib/dashboard";
import type { PostStatus } from "@/types";

export function StatusBadge({ status }: { status: PostStatus }) {
  const s = POST_STATUS[status];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

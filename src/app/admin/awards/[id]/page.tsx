import { AwardDetail } from "@/features/admin/awards/ui/award-detail";
import { use } from "react";
interface Props {
  params: Promise<{ id: string }>;
}
export default function AwardDetailPage({ params }: Props) {
  const { id } = use(params);
  return <AwardDetail id={id} />;
}

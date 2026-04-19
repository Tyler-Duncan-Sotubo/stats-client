import { RecordDetail } from "@/features/admin/records/ui/record-detail";
import { use } from "react";
interface Props {
  params: Promise<{ id: string }>;
}
export default function RecordDetailPage({ params }: Props) {
  const { id } = use(params);
  return <RecordDetail id={id} />;
}

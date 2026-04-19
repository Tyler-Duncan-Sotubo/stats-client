import { CertificationDetail } from "@/features/admin/certifications/ui/certification-detail";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function CertificationDetailPage({ params }: Props) {
  const { id } = use(params);
  return <CertificationDetail id={id} />;
}

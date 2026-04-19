import { ArtistDetail } from "@/features/admin/artists/ui/artist-detail";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ArtistDetailPage({ params }: Props) {
  const { id } = use(params);
  return <ArtistDetail id={id} />;
}

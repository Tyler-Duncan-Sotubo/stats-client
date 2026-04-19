import { SongDetail } from "@/features/admin/songs/ui/song-detail";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function SongDetailPage({ params }: Props) {
  const { id } = use(params);
  return <SongDetail id={id} />;
}

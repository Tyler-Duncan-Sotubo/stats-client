import { AlbumDetail } from "@/features/admin/albums/ui/album-detail";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function AlbumDetailPage({ params }: Props) {
  const { id } = use(params);
  return <AlbumDetail id={id} />;
}

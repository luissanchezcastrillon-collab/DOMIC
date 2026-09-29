import { notFound } from "next/navigation";
import { RestaurantDetail } from "@/app/components/RestaurantDetail";
import { fetchBusinessById } from "@/app/lib/db";
import { findBusiness } from "@/app/lib/directory";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NegocioDetallePage({ params }: Props) {
  const { id } = await params;
  const found =
    (await fetchBusinessById(id).catch(() => null)) ?? findBusiness(id);
  if (!found) notFound();

  return <RestaurantDetail biz={found.biz} section={found.section} />;
}

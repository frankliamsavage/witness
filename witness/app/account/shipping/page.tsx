import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Shipping Info",
  description: "Save shipping details to speed up checkout on Witness.",
};

export default async function ShippingInfoPage() {
  redirect("/account/addresses");
}

import { getInitialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

export default async function SetupPage() {
  await getInitialProfile();
  redirect("/main");
}

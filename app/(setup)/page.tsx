import { getInitialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  await getInitialProfile();
  redirect("/main");
};

export default SetupPage;

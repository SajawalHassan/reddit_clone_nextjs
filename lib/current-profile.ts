import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const getCurrentProfile = async (user?: any) => {
  let userId = "";
  if (!user) {
    const { userId: userIdAuth } = auth();
    if (!userIdAuth) return null;

    userId = userIdAuth;
  } else {
    userId = user.id;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};

import { db } from "@/lib/db";
import { redirectToSignIn, currentUser } from "@clerk/nextjs";

export const getInitialProfile = async () => {
  try {
    await db.$connect();

    const user = await currentUser();
    if (!user) return redirectToSignIn();

    const profile = await db.profile.findUnique({
      where: {
        userId: user?.id,
      },
    });
    if (profile) return profile;

    const newProfile = await db.profile.create({
      data: {
        userId: user?.id,
        displayName: `${user?.firstName} ${user?.lastName}`,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
      },
    });

    return newProfile;
  } catch (error) {
    console.log("INITIAL_PROFILE_ERROR:", error);
  }
};

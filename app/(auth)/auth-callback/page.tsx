import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/app/db";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { origin?: string };
}) {
  console.log("Auth-callback");
  console.log("Search params:", searchParams);

  const user = await currentUser();

  console.log("Current user is: ", user ? "User found" : "null");
  if (user) {
    console.log("User ID:", user.id);
    console.log("User email:", user.emailAddresses[0]?.emailAddress);
  }

  if (!user || !user.id) {
    console.log("No user found, redirecting to sign-in");
    redirect("/sign-up");
  }

  const existingUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!existingUser) {
    await db.user.create({
      data: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
      },
    });
    console.log("✅ User added to db");
  } else {
    console.log("User already exists in db");
  }

  redirect(searchParams.origin || "/markets");
}

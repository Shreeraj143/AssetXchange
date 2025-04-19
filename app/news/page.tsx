import { currentUser } from "@clerk/nextjs/server";
import CryptoNews from "../components/CryptoNews";
import MaxWidthWrapper from "../components/MaxWidthWrapper";
import { redirect } from "next/navigation";
import { db } from "../db";

export default async function Home() {
  const user = await currentUser();

  if (!user) redirect("/auth-callback?origin=news");

  const dbUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) redirect("/auth-callback?origin=news");
  return (
    <MaxWidthWrapper className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Crypto Exchange</h1>
      <CryptoNews />
    </MaxWidthWrapper>
  );
}

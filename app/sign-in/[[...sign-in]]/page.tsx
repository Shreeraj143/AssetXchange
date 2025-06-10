import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { cn } from "@/lib/utils";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <MaxWidthWrapper className={cn("flex justify-center items-center mt-24")}>
      <SignIn />
    </MaxWidthWrapper>
  );
}

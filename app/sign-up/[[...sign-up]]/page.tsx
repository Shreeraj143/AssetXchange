import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { cn } from "@/lib/utils";
import { SignUp } from "@clerk/nextjs";

const Signup = () => {
  return (
    <MaxWidthWrapper className={cn("flex justify-center items-center mt-24")}>
      <SignUp />
    </MaxWidthWrapper>
  );
};

export default Signup;

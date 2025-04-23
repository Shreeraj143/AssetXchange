// "use client";

// import { usePathname } from "next/navigation";
// import { PrimaryButton, SuccessButton } from "./core/Button";
// import { useRouter } from "next/navigation";

// export const Appbar = () => {
//   const route = usePathname();
//   const router = useRouter();

//   return (
//     <div className="text-white border-b border-slate-800">
//       <div className="flex justify-between items-center p-2">
//         <div className="flex">
//           <div
//             className={`text-xl pl-4 flex flex-col justify-center cursor-pointer text-white`}
//             onClick={() => router.push("/")}
//           >
//             Exchange
//           </div>
//           <div
//             className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${
//               route.startsWith("/markets") ? "text-white" : "text-slate-500"
//             }`}
//             onClick={() => router.push("/markets")}
//           >
//             Markets
//           </div>
//           <div
//             className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${
//               route.startsWith("/trade") ? "text-white" : "text-slate-500"
//             }`}
//             onClick={() => router.push("/trade/SOL_USDC")}
//           >
//             Trade
//           </div>
//           <div
//             className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${
//               route.startsWith("/news") ? "text-white" : "text-slate-500"
//             }`}
//             onClick={() => router.push("/news")}
//           >
//             News
//           </div>
//         </div>
//         <div className="flex">
//           <div className="p-2 mr-2">
//             <SuccessButton>Deposit</SuccessButton>
//             <PrimaryButton>Withdraw</PrimaryButton>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";

import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const Appbar = () => {
  const { userId } = useAuth();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-300 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href={"/"} className="flex z-40 font-semibold">
            <span>AX</span>
          </Link>

          {/* Todo: Add mobile navbar */}

          <div className="hidden items-center space-x-4 sm:flex text-sm font-medium">
            <>
              <Link
                href={"/markets"}
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Markets
              </Link>

              <Link
                href={"/trade/SOL_USDC"}
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Trade
              </Link>

              <Link
                href={"/news"}
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                News
              </Link>

              <SignedOut>
                <SignInButton forceRedirectUrl={"/markets"} />
              </SignedOut>

              <SignedOut>
                <Link
                  href={"/sign-up"}
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  Get Started
                  <ArrowRight />
                </Link>
              </SignedOut>

              <SignedIn>
                <Link
                  href={"/orders"}
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Orders
                </Link>
              </SignedIn>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

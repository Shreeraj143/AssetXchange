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
                <Link
                  href={"/portfolio"}
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Portfolio
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

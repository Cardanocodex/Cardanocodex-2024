import { useState } from "react";
import type { NextPage } from "next";
import ConnectWallet from "@/components/common/connect-wallet";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <main className="z-50">
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Link href="/create" passHref legacyBehavior>
          <Button asChild size="lg" className="w-64 text-lg">
            <a>Create Link</a>
          </Button>
        </Link>
        <Link href="/redeem" passHref legacyBehavior>
          <Button asChild size="lg" variant="outline" className="w-64 text-lg">
            <a>Redeem Link</a>
          </Button>
        </Link>
      </div>
    </main>
  );
}

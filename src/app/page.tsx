"use client";
import React from "react";
import type { NextPage } from "next";
import StakingPage from "@/app/components/StakingPage";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20 text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 m-6 flex items-center gap-4">
        <Image
          src="/abs-finance-logo.png"
          alt="ABS Finance logo"
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <h1 className="text-xl font-bold">ABS Finance</h1>
          <p className="text-sm text-white/60">
            Earn yield on your staking tokens
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        <StakingPage />
      </main>
    </div>
  );
};

export default Home;

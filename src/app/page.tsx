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

      {/* Network Status */}
      <div className="absolute top-0 right-0 m-6">
        <div className="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm">Mainnet</span>
          <span className="text-sm text-white/60">|</span>
          <span className="text-sm text-white/60">Priority Fees: Dynamic</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        <StakingPage />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-white/60">
        <div className="flex justify-center gap-8 mb-4">
          <button className="hover:text-white">FAQ</button>
          <button className="hover:text-white">Terms</button>
          <button className="hover:text-white">Docs</button>
        </div>
        <p className="text-sm">Powered by ABS Finance</p>
      </footer>
    </div>
  );
};

export default Home;

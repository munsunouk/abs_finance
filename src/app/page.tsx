"use client";
import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import Header from "@/app/components/Header";
import MarketOverview from "@/app/components/MarketOverview";
import StakingOptions from "@/app/components/StakingOptions";
import Footer from "@/app/components/Footer";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <div className="absolute top-0 left-0 m-4">
        <Image
          src="/universe-wave-logo.png"
          alt="Universe Wave Logo"
          width={100}
          height={100}
        />
      </div>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">ABS Finance</h1>
        <MarketOverview />
        <StakingOptions />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

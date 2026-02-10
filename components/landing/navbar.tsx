"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 inset-x-0 z-100 h-24 flex items-center justify-center px-6">
      {/* The Glass Container */}
      <div className="w-full max-w-7xl h-16 flex items-center justify-between px-8 rounded-2xl border border-white/10 bg-white/2 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
        
        {/* Brand Logo with 3D Glow */}
        <Link href="/#home">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative h-9 w-9">
              <Image src="/logo.svg" alt="Syntra Academy Logo" width={30} height={30} />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">
              Syntra<span className="text-indigo-500">Academy</span>
            </span>
          </div>
        </Link>

        {/* Floating Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          {["Features", "PCI", "Roles", "Docs"].map((link) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase().replace(" ", "-")}`} 
              className="text-sm font-medium text-neutral-400 hover:text-white transition-all relative group"
            >
              {link}
              {/* 3D Underline Accent */}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-indigo-500 to-cyan-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* 3D Glass Action Button */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="hidden sm:block text-sm font-medium text-neutral-500 hover:text-neutral-200 hover:cursor-pointer transition-colors">
              Sign In
            </button>
          </Link>
          
          <Link href="/register">
            <button className="relative inline-flex h-10 overflow-hidden rounded-full p-px focus:outline-none group">
              <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#818CF8_0%,#22D3EE_50%,#818CF8_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-bold text-white backdrop-blur-3xl transition-all group-hover:bg-slate-950/90">
                Register
              </span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
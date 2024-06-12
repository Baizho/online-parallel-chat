"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function Header() {
  return (
    <div className="flex items-center justify-between w-full bg-black h-16  ">
      <div className="flex items-center pl-6">
        <Link
          href="/"
          className="text-3xl font-sans  font-bold h-full text-white"
        >
          Chat
        </Link>
      </div>
      <div className="flex items-center pr-6">
        <Link
          href="/login"
          className="text-2xl font-sans pl-6 font-bold h-full text-white"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="text-2xl font-sans pl-6 font-bold h-full text-white"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

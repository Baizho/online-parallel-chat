"use client";

import React, { createRef, useRef } from "react";
import { useState } from "react";
import axios from "axios";

import { io } from "socket.io-client";
import { useRouter } from "next/navigation";

type Props = {};

const LoginPage = () => {
  const [success, setSuccess] = useState(-1);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = e.currentTarget.username.value;
    const password = e.currentTarget.password.value;
    const socket = io("wss://online-parallel-chat.onrender.com/");
    socket.emit("sendLogin", {
      username: username,
      password: password,
    });
    socket.on("checkLogin", (user) => {
      // console.log(user);
      if (user === null) setSuccess(0);
      else {
        router.push("/");
        setSuccess(1);
      }
      const userPrev = window.localStorage.getItem("chat-user");
      if (userPrev !== null && user !== userPrev) {
        socket.emit("disconnectingUser", userPrev);
      }
      window.localStorage.setItem("chat-user", user);
    });
  };
  return (
    <div className="min-h-screen">
      <div className="flex items-start pt-20 justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form
            className="mt-8 space-y-6"
            onSubmit={(e) => {
              handleSubmit(e);
              e.currentTarget.username.value = "";
              e.currentTarget.password.value = "";
            }}
          >
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
            {success === 0 && (
              <div className="text-center text-red-500">
                Try again (Maybe register)
              </div>
            )}
            {success === 1 && (
              <div className="text-center text-green-500">Success! </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

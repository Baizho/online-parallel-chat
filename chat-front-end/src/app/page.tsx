"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import MessageCard from "@/components/Chat/MessageCard";
import { io } from "socket.io-client";
import MessageCardUser from "@/components/Chat/MessageCardUser";
import OnlineList from "@/components/Chat/OnlineList";

type Props = {};

interface Message {
  username: string;
  content: string;
}

const home = (props: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [curUser, setCurUser] = useState("");
  const router = useRouter();

  const handleType = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(message);
    const user = window.localStorage.getItem("chat-user");
    if (user === null) router.push("/login");
    else {
      const socket = io("http://localhost:4000");
      socket.emit("sendMessage", {
        username: user,
        message: message,
      });
      setCurUser(user);
    }
    setMessage("");
  };

  useEffect(() => {
    const user = window.localStorage.getItem("chat-user");
    if (user !== null) setCurUser(user);
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("messages", (arg) => {
      //   console.log("here");
      setMessages(arg);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  }, []);
  return (
    <div className="h-screen max-h-[500px] w-full flex justify-center mt-4">
      <div className="w-1/3">
        <OnlineList />
      </div>
      <div className="flex flex-col w-2/3 h-full border-2">
        <div className="h-[85%] w-full pl-4 mr-4 overflow-y-auto ">
          {messages.map((message, index) => {
            if (message.username === curUser) {
              return <MessageCardUser key={index} message={message} />;
            }
            return <MessageCard key={index} message={message} />;
          })}
        </div>
        <form
          className="h-[15%] flex w-full justify-center items-center bg-white border-2"
          onSubmit={(e) => {
            handleType(e);
          }}
        >
          <input
            type="text"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            value={message}
            placeholder="Type a message..."
            className="border-2 w-[97%] rounded h-[60%] pl-3 focus:outline-gray-400"
          ></input>
        </form>
      </div>
    </div>
  );
};

export default home;

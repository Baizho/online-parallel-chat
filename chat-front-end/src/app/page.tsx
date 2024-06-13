"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const messageEl = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleType = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(message);
    const user = window.localStorage.getItem("chat-user");
    if (user === null) {
      alert("login please");
      router.push("/login");
    } else {
      const socket = io("wss://online-parallel-chat.onrender.com", {
        transports: ["websocket"],
      });
      socket.emit("sendMessage", {
        username: user,
        message: message,
      });
      setCurUser(user);
    }
    setMessage("");
  };
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setMessage(e.target.value);
  };
  useEffect(() => {
    const user = window.localStorage.getItem("chat-user");
    if (user === null) {
      alert("login please");
      router.push("/login");
    } else {
      const socket = io("wss://online-parallel-chat.onrender.com", {
        transports: ["websocket"],
      });
      console.log(message);
      if (message.length === 0) {
        socket.emit("removeTyping", user);
      } else {
        socket.emit("addTyping", user);
      }
    }
  }, [message]);

  useEffect(() => {
    if (messageEl !== null && messageEl.current !== null) {
      messageEl.current.addEventListener(
        "DOMNodeInserted",
        (event: { currentTarget: any }) => {
          const { currentTarget: target } = event;
          target.scroll({ top: target.scrollHeight, behavior: "smooth" });
        }
      );
    }

    const user = window.localStorage.getItem("chat-user");
    if (user !== null) {
      if (Object.keys(typingUsers).find((item) => item === user) === null) {
        alert("login please");
        router.push("/login");
      }
      setCurUser(user);
    }
    const socket = io("wss://online-parallel-chat.onrender.com", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("messages", (arg) => {
      //   console.log("here");
      setMessages(arg);
    });
    socket.on("onlineUsers", (arg) => {
      // console.log(arg);
      setOnlineUsers(arg);
    });
    socket.on("typingUsers", (arg) => {
      setTypingUsers(arg);
    });

    socket.on("disconnect", () => {
      socket.emit("disconnectingUser", user);
      console.log("disconnected");
    });
  }, []);
  return (
    <div className="h-screen max-h-[500px]">
      <div className="text-center flex flex-col">
        {Object.keys(typingUsers).map((user, index) => {
          return <div key={index}>{user} is typing</div>;
        })}
      </div>
      <div className="w-full flex justify-center h-screen max-h-[500px]">
        <div className="w-1/3">
          <OnlineList onlineUsers={onlineUsers} />
        </div>
        <div className="flex flex-col w-2/3 h-full border-2">
          <div
            className="h-[85%] w-full pl-4 mr-4 overflow-y-auto "
            ref={messageEl}
          >
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
                handleTyping(e);
              }}
              value={message}
              placeholder="Type a message..."
              className="border-2 w-[97%] rounded h-[60%] pl-3 focus:outline-gray-400"
            ></input>
          </form>
        </div>
      </div>
    </div>
  );
};

export default home;

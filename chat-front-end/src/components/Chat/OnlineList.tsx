"use client";

import React, { useEffect, useState } from "react";

type Props = {
  onlineUsers: object;
};

const OnlineList = (props: Props) => {
  return (
    <div className="flex flex-col">
      <div className="text-xl font-bold text-center">Online Users</div>
      <ul>
        {Object.keys(props.onlineUsers).map((user, index) => {
          return (
            <li key={index} className="pl-4 text-lg font-semibold">
              {user}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OnlineList;

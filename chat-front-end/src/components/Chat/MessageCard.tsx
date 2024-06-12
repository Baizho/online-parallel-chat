import React from "react";

interface Message {
  username: string;
  content: string;
}

type Props = {
  message: Message;
};

const MessageCard = (props: Props) => {
  return (
    <div className="my-4">
      <div className="text-base text-black">{props.message.username}</div>
      <div className="w-1/2 max-w-[300px] min-h-12 py-2 px-4 rounded-xl flex items-center bg-gray-200 text-black">
        {props.message.content}
      </div>
    </div>
  );
};

export default MessageCard;

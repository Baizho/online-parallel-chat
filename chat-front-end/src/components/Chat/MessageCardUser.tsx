import React from "react";

interface Message {
  username: string;
  content: string;
}

type Props = {
  message: Message;
};

const MessageCardUser = (props: Props) => {
  return (
    <div className="my-4 flex justify-end w-full">
      <div className="w-1/2">
        <div className="text-base text-black text-end px-4">
          {props.message.username}
        </div>
        <div className="w-full max-w-[400px] min-h-12 py-2 px-4 rounded-xl flex items-center bg-blue-200 text-black">
          {props.message.content}
        </div>
      </div>
    </div>
  );
};

export default MessageCardUser;

import { useEffect } from "react";
import { chatStore } from "../store/chatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, formatDateLabel } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    chatStore();

  const { authUser } = useAuthStore();

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => {
          const prevMessage = messages[index - 1];

          const showDate =
            !prevMessage ||
            new Date(prevMessage.createdAt).toDateString() !==
              new Date(message.createdAt).toDateString();

          const isOwn = message.senderId === authUser._id;

          return (
            <div key={message._id}>
              {/* ✅ Date separator */}
              {showDate && (
                <div className="flex justify-center my-3">
                  <span className="text-xs bg-base-200 px-3 py-1 rounded-full opacity-70">
                    {formatDateLabel(message.createdAt)}
                  </span>
                </div>
              )}

              <div className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        isOwn
                          ? authUser.profilePic || "/profile.png"
                          : selectedUser.profilePic || "/profile.png"
                      }
                      alt="profile"
                    />
                  </div>
                </div>

                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>

                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}

                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;

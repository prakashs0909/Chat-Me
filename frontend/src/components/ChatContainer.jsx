import { useEffect, useMemo, useRef, useState } from "react";
import { chatStore } from "../store/chatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, getDateLabel } from "../lib/utils";
import { X } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    listenMessage,
    unlistenMessage,
  } = chatStore();

  const [previewImage, setPreviewImage] = useState(null);
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);
    listenMessage();

    return () => {
      unlistenMessage();
    };
  }, [selectedUser?._id]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const groupedMessages = useMemo(() => {
    return messages.reduce((acc, message) => {
      const dateKey = new Date(message.createdAt).toDateString();

      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(message);

      return acc;
    }, {});
  }, [messages]);

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
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date} className="space-y-2">
            <div className="sticky top-0 z-10 flex justify-center">
              <span className="text-xs bg-base-200 px-3 py-1 rounded-full opacity-80 shadow">
                {getDateLabel(date)}
              </span>
            </div>

            {msgs.map((message, index) => {
              const isOwn = message.senderId === authUser?._id;
              const isLastMessage =
                date ===
                  Object.keys(groupedMessages)[
                    Object.keys(groupedMessages).length - 1
                  ] && index === msgs.length - 1;

              return (
                <div
                  key={message._id}
                  className={`chat ${isOwn ? "chat-end" : "chat-start"}`}
                  ref={isLastMessage ? messageEndRef : null}
                >
                  <div className="chat-image avatar">
                    <div className="size-10 rounded-full border">
                      <img
                        src={
                          isOwn
                            ? authUser?.profilePic || "/profile.png"
                            : selectedUser?.profilePic || "/profile.png"
                        }
                        alt="profile"
                      />
                    </div>
                  </div>

                  <div className="chat-bubble flex flex-col">
                    {message.image && (
                      <div className="relative overflow-hidden rounded-md pb-2.5">
                        <img
                          src={message.image}
                          alt="attachment"
                          onClick={() =>
                            !message.isSending && setPreviewImage(message.image)
                          }
                          className={`sm:max-w-[240px] rounded-md mb-2 cursor-pointer transition ${
                            message.isSending
                              ? "opacity-70"
                              : "hover:opacity-90"
                          }`}
                        />

                        {message.isSending && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                            <div className="relative flex items-center justify-center">
                              <span className="loading loading-spinner loading-lg text-emerald-500"></span>
                              <X className="absolute size-5 text-white" />
                            </div>
                          </div>
                        )}

                        {message.isFailed && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
                            <span className="text-xs text-red-300 font-semibold">
                              Failed
                            </span>
                          </div>
                        )}

                        <span className="absolute bottom-0 right-0 text-[10px] opacity-60">
                          {message.isSending
                            ? "Sending..."
                            : formatMessageTime(message.createdAt)}
                        </span>
                      </div>
                    )}

                    {message.text && (
                      <p className="relative pr-12 break-words">
                        <span>{message.text}</span>
                        <span className="absolute bottom-0 right-0 text-[10px] opacity-60">
                          {formatMessageTime(message.createdAt)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute right-5 top-5 text-white text-3xl font-bold"
          >
            <X className="size-8" />
          </button>

          <img
            src={previewImage}
            alt="preview"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;

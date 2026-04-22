import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const chatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
        const res = await axiosInstance.get("/messages/users");
        console.log(res.data)
        set({users: res.data})
    } catch (error) {
      const message = error.response?.data?.message ||error.message || "Something went wrong";
      toast.error(message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

   getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      const message = error.response?.data?.message ||error.message || "Something went wrong";
      toast.error(message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

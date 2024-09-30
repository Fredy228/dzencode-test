import { create } from "zustand";
import { UserInterface } from "../interface/user.interface";

interface StoreInterface {
  user: UserInterface | null;
  setUser: (user: UserInterface) => void;
  clearUser: () => void;
}

const useStore = create<StoreInterface>((set) => ({
  user: null,
  setUser: (user: UserInterface | null) => set(() => ({ user })),
  clearUser: () => set(() => ({ user: null })),
}));

export default useStore;

import React, { createContext, useState, useContext, ReactNode } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
};

type UserContextType = {
  users: User[];
  addUser: (user: User) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const addUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  return (
    <UserContext.Provider value={{ users, addUser, currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

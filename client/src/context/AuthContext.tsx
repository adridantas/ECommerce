import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthenticatedUser, AuthenticationResponse } from "@/commons/types";
import { api } from "@/lib/axios";

interface AuthContextType {
  authenticated: boolean;
  authenticatedUser?: AuthenticatedUser;
  handleLogin: (authenticationResponse: AuthenticationResponse) => Promise<void>;
  handleLogout: () => void;
  loading: boolean; 
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setAuthenticatedUser(JSON.parse(storedUser));
      setAuthenticated(true);
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false); 
  }, []);

  const handleLogin = async (authenticationResponse: AuthenticationResponse) => {
    localStorage.setItem("token", authenticationResponse.token);
    localStorage.setItem("user", JSON.stringify(authenticationResponse.user));
    api.defaults.headers.common["Authorization"] = `Bearer ${authenticationResponse.token}`;
    setAuthenticatedUser(authenticationResponse.user);
    setAuthenticated(true);
    setLoading(false); 
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setAuthenticated(false);
    setAuthenticatedUser(undefined);
    setLoading(false); 
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, authenticatedUser, handleLogin, handleLogout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

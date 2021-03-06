import React, { createContext, useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import APIService from 'services/api';
import jwt from 'jsonwebtoken';

export type DecodeUser = {
  id: number;
  sub: string;
  auth: string;
  name: string;
};

type AuthContextData = {
  signIn(email: string, password: string): Promise<void | Error>;
  signOut(): void;
  getSession(): DecodeUser;
  getToken(): string;
};

const TOKEN_KEY = '@yTjy57Lj8E/UC9vpLBIv5cMXxWY1xj27ub/D6GavBOw=';

export const getToken = (): string => localStorage.getItem(TOKEN_KEY);

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const navigate = useNavigate();
  const [userToken, setUserToken] = useState<string>(() => {
    const storageToken = localStorage.getItem(TOKEN_KEY);
    if (storageToken) {
      return storageToken;
    }
    return '';
  });

  const getSession = useCallback(() => {
    const userDecoded = JSON.stringify(jwt.decode(userToken));
    return JSON.parse(userDecoded);
  }, [userToken]);

  const signIn = useCallback(
    async (email, password) => {
      try {
        const token = await APIService.login(email, password);

        setUserToken(token);
        const userRole = jwt.decode(token) as DecodeUser;

        if (userRole) {
          navigate(userRole.auth === 'USER' ? '/' : '/admin');
        }
        localStorage.setItem(TOKEN_KEY, token);
        return Promise.resolve();
      } catch (err) {
        return Promise.reject(err);
      }
    },
    [navigate]
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUserToken('');
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ signIn, signOut, getSession, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

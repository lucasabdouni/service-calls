import axios from 'axios';
import { ReactNode, createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/axios';

interface User {
  id: string;
  name: string;
  email: string;
  registration_number: number;
  department: string;
  ramal: number;
  role: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn: (credentials: SignInCredentials) => Promise<void | string>;
  signOut: () => Promise<void>;
  user: User;
  loading: boolean;
  isAuthenticated: boolean;
}

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          api.defaults.headers.Authorization = `Bearer ${token}`;

          const response = await api.get('/me');
          setUser(response.data.user);
        } catch (error) {
          setUser({} as User);
          localStorage.removeItem('token');
          navigate('/');
        }
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  async function signIn({
    email,
    password,
  }: SignInCredentials): Promise<string | undefined> {
    try {
      const response = await api.post('/sessions', {
        email,
        password,
      });

      const { token } = response.data;

      localStorage.setItem('token', token);

      api.defaults.headers.Authorization = `Bearer ${token}`;

      const responseGetUser = await api.get('/me');

      setUser(responseGetUser.data.user);

      navigate('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (
          err.response?.status === 401 &&
          err.response?.data.message === 'Invalid credentials'
        ) {
          return 'Verifique os dados informados.';
        }
      } else {
        return 'Ocorreu um erro. Por favor, tente novamente.';
      }
    }
  }

  async function signOut() {
    try {
      setUser({} as User);
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      // Handle error (if any)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, signIn, isAuthenticated, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticate } from '../api/authenticate';
import { getProfile, getProfileResponse } from '../api/get-profile';
import { notify } from '../components/notification';
import { api } from '../lib/axios';
import { UserProps } from '../types/user';

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn: (credentials: SignInCredentials) => Promise<void | string>;
  signOut: () => Promise<void>;
  loading: boolean;
  isLoadingProfile: boolean;
  isAuthenticated: boolean;
  user: getProfileResponse;
}

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<getProfileResponse>(
    {} as getProfileResponse,
  );
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user.id;
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutateAsync: session } = useMutation({
    mutationFn: authenticate,
  });

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      const user = await getProfile();
      return user;
    } else {
      setUser({} as UserProps);
      setLoading(false);
      navigate('/');
      return null;
    }
  };

  const {
    data: userFetch,
    isLoading: isLoadingProfile,
    isSuccess,
    isError,
  } = useQuery({
    retry: false,
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (userFetch && isSuccess) {
      setUser(userFetch);
      setLoading(false);
    }
  }, [userFetch, isSuccess]);

  useEffect(() => {
    if (!isLoadingProfile && isError) {
      setUser({} as UserProps);
      localStorage.removeItem('token');
      navigate('/');
    }
  }, [isLoadingProfile, isError]);

  async function signIn({
    email,
    password,
  }: SignInCredentials): Promise<string | undefined> {
    try {
      const { token } = await session({
        email,
        password,
      });

      localStorage.setItem('token', token);

      api.defaults.headers.Authorization = `Bearer ${token}`;

      navigate('/dashboard');

      notify({
        type: 'success',
        message: 'Login realizado com sucesso.',
        description: 'Bem-vindo de volta!',
      });

      queryClient.invalidateQueries({ queryKey: ['user'] });
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
      localStorage.removeItem('token');
      queryClient.removeQueries({ queryKey: ['user'] });
      navigate('/');
    } catch (error) {
      // Handle error (if any)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        isAuthenticated,
        signOut,
        loading,
        user,
        isLoadingProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

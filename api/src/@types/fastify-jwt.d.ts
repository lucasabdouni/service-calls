import { Role } from '@/repositories/user-repository';
import '@fastify/jwt';

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string;
      role: Role;
    };
  }
}

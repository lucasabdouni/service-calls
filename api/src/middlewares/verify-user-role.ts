import { ClientError } from '@/errors/client-erro';
import { Role } from '@/repositories/user-repository';
import { FastifyReply, FastifyRequest } from 'fastify';

export function verifyUserRole(...rolesToVerify: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;

    if (!rolesToVerify.includes(role)) {
      throw new ClientError(401, 'Unauthorized');
    }
  };
}

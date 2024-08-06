import { ClientError } from '@/errors/client-erro';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    if (request.user) {
      throw new ClientError(401, 'token.expired');
    } else throw new ClientError(401, 'Unauthorized');
  }
}

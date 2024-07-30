import { ClientError } from '@/errors/client-erro';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw new ClientError(401, 'Unauthorized');
  }
}

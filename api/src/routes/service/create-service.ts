import { env } from '@/env';
import { ClientError } from '@/errors/client-erro';
import { getMailClient } from '@/lib/mail';
import { getDepartmentById } from '@/repositories/department-respository';
import { createService } from '@/repositories/service-repository';
import { getUserById } from '@/repositories/user-repository';
import { FastifyRequest } from 'fastify';
import nodemailer from 'nodemailer';
import z from 'zod';

const PriorityEnum = z.enum(['Baixa', 'Media', 'Alta']);

const bodySchema = z.object({
  local: z.string({ message: 'Local is mandatory' }),
  problem: z.string({ message: 'Problem is mandatory' }),
  department_id: z
    .string({ message: 'Department is mandatory' })
    .uuid({ message: 'Department id is invalid' }),
  problem_description: z.string({
    message: 'Description of the problem pro is mandatory',
  }),
  priority: PriorityEnum,
});

export const createServiceHandler = async (request: FastifyRequest) => {
  const { department_id, local, problem, problem_description, priority } =
    bodySchema.parse(request.body);

  const user = await getUserById(request.user.sub);
  if (!user) throw new ClientError(409, 'User not found.');

  const departmentDetails = await getDepartmentById(department_id);
  if (!departmentDetails) throw new ClientError(409, 'Department not found.');

  const data = {
    local,
    problem,
    problem_description,
    priority,
    user_id: user.id,
    department_id,
  };

  const service = await createService(data);

  const mail = await getMailClient();

  await Promise.all(
    departmentDetails.responsables.map(async (responsable) => {
      const serviceLink = `${env.WEB_URL}/servico/${service.id}`;

      const message = await mail.sendMail({
        from: {
          name: 'Gerenciador de Serviços',
          address: 'oi@service.com.br',
        },
        to: responsable.email,
        subject: `Nova requisição de serviço: ${service.problem}`,
        html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Olá, recebemos uma nova requição de serviço: <strong>${service.problem}</strong></p>
              <p></p>
              <p>Descrição do do serviço:</p>
              <p></p>
              <p>${service.problem_description}</p>
              <p>Local: ${service.local}</p>
              <p>
                <a href="${serviceLink}">Visualizar</a>
              </p>
              <p></p>
              <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
            </div>
          `.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));
    }),
  );

  return { service };
};

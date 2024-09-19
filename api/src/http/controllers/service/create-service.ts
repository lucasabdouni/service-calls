import { env } from '@/env';
import { getMailClient } from '@/lib/mail';
import { CreateServiceUseCase } from '@/use-cases/create-service';
import { FastifyRequest } from 'fastify';
import nodemailer from 'nodemailer';
import z from 'zod';

const PriorityEnum = z.enum(['Baixa', 'Media', 'Alta']);

const bodySchema = z.object({
  local: z.string({ message: 'Local is mandatory' }),
  problem: z.string({ message: 'Problem is mandatory' }),
  departmentId: z
    .string({ message: 'Department is mandatory' })
    .uuid({ message: 'Department id is invalid' }),
  problemDescription: z.string({
    message: 'Description of the problem pro is mandatory',
  }),
  priority: PriorityEnum,
});

export const createServiceHandler = async (request: FastifyRequest) => {
  const { departmentId, local, problem, problemDescription, priority } =
    bodySchema.parse(request.body);

  const userId = request.user.sub;

  const data = {
    local,
    problem,
    problemDescription,
    priority,
    userId,
    departmentId,
  };

  const { service, departmentDetails } = await CreateServiceUseCase(data);

  const mail = await getMailClient();

  await Promise.all(
    departmentDetails.responsables.map(async (responsable) => {
      const serviceLink = `${env.WEB_URL}/servico/${service.id}`;

      const message = await mail.sendMail({
        from: {
          name: 'Gerenciador de Serviços',
          address: 'no-reply@cinbal.com.br',
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

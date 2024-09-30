import { env } from '@/env';
import { getMailClient } from '@/lib/mail';
import { CreateJobUseCase } from '@/use-cases/job/create-job';
import { FastifyRequest } from 'fastify';
import nodemailer from 'nodemailer';
import z from 'zod';

const PriorityEnum = z.enum(['Baixa', 'Media', 'Alta']);

const bodySchema = z.object({
  local: z.string({ message: 'Local is mandatory' }),
  problemDescription: z.string({
    message: 'Description of the problem pro is mandatory',
  }),
  priority: PriorityEnum,
  departmentId: z
    .string({ message: 'Department is mandatory' })
    .uuid({ message: 'Department id is invalid' }),
  serviceId: z
    .string({ message: 'Service is mandatory' })
    .uuid({ message: 'Service id is invalid' })
    .optional(),
});

export const createJobHandler = async (request: FastifyRequest) => {
  const { departmentId, local, problemDescription, priority, serviceId } =
    bodySchema.parse(request.body);

  const userId = request.user.sub;

  const data = {
    local,
    serviceId,
    problemDescription,
    priority,
    userId,
    departmentId,
  };

  const { job, departmentDetails } = await CreateJobUseCase(data);

  const mail = await getMailClient();

  await Promise.all(
    departmentDetails.responsables.map(async (responsable) => {
      const jobLink = `${env.WEB_URL}/servico/${request.id}`;

      const message = await mail.sendMail({
        from: {
          name: 'Portal de Chamados',
          address: 'no-reply@cinbal.com.br',
        },
        to: responsable.email,
        subject: `Nova requisição de serviço: ${job.service && job.service.name}`,
        html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Olá, recebemos uma nova requição de serviço: <strong>${job.service && job.service.name}</strong></p>
              <p></p>
              <p>Descrição do do serviço:</p>
              <p></p>
              <p>${job.problem_description}</p>
              <p>Local: ${job.local}</p>
              <p>
                <a href="${jobLink}">Visualizar</a>
              </p>
              <p></p>
              <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
            </div>
          `.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));
    }),
  );

  return job;
};

import { env } from '@/env';
import { getMailClient } from '@/lib/mail';
import { UpdateJobUseCase } from '@/use-cases/job/update-job';
import { FastifyRequest } from 'fastify';
import nodemailer from 'nodemailer';
import z from 'zod';

const PriorityEnum = z.enum(['Baixa', 'Media', 'Alta']);

const bodySchema = z.object({
  local: z.string().optional(),
  problemDescription: z.string().optional(),
  priority: PriorityEnum.optional(),
  occurs_at: z.coerce.date().optional(),
  status: z.string().optional(),
});

const paramsSchema = z.object({
  jobId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const updateJobHandler = async (request: FastifyRequest) => {
  const data = bodySchema.parse(request.body);
  const { jobId } = paramsSchema.parse(request.params);
  const { role } = request.user;
  const userId = request.user.sub;

  const { job } = await UpdateJobUseCase({
    data,
    jobId,
    userId,
    role,
  });

  const mail = await getMailClient();

  const jobLink = `${env.WEB_URL}/servico/${job.id}`;

  const message = await mail.sendMail({
    from: {
      name: 'Gerenciador de Serviços',
      address: 'no-reply@cinbal.com.br',
    },
    to: job.user.email,
    subject: `Requisição de serviço atualizada: ${job.service?.name} `,
    html: `
              <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                <p>Olá, temos uma nova atualização na sua solicitação: </strong></p>
                <p></p>
                <p>Descrição do do serviço:</p>
                <p></p>
                <p>${job.service?.name}</p>
                <p>${job.problem_description}</p>
                <p></p>
                <p>Status:</p>
                <p>${job.status}</p>
                <p>
                  <a href="${jobLink}">Visualizar</a>
                </p>
                <p></p>
                <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
              </div>
            `.trim(),
  });

  console.log(nodemailer.getTestMessageUrl(message));

  return { job: job };
};

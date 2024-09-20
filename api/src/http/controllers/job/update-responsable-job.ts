import { env } from '@/env';
import { getMailClient } from '@/lib/mail';
import { UpdateResponsableJobUseCase } from '@/use-cases/job/update-responsable-job';
import { FastifyRequest } from 'fastify';
import nodemailer from 'nodemailer';
import z from 'zod';

const bodySchema = z.object({
  responsableId: z
    .string({ message: 'Service is mandatory' })
    .uuid({ message: 'Service id is invalid' }),
});

const paramsSchema = z.object({
  jobId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const updateResponsableJobHandler = async (request: FastifyRequest) => {
  const { responsableId } = bodySchema.parse(request.body);
  const { jobId } = paramsSchema.parse(request.params);

  const { role } = request.user;
  const userId = request.user.sub;

  const { job } = await UpdateResponsableJobUseCase({
    jobId,
    responsableId,
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

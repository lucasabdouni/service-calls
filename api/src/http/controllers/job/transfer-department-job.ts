import { env } from '@/env';
import { getMailClient } from '@/lib/mail';
import { TransferDepartmentJobUseCase } from '@/use-cases/job/transfer-department-job';
import { FastifyRequest } from 'fastify';
import nodemailer from 'nodemailer';
import z from 'zod';

const bodySchema = z.object({
  departmentId: z
    .string({ message: 'Department is mandatory' })
    .uuid({ message: 'Department id is invalid' }),
});

const paramsSchema = z.object({
  jobId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const transferDepartmentJobHandler = async (request: FastifyRequest) => {
  const { departmentId } = bodySchema.parse(request.body);
  const { jobId } = paramsSchema.parse(request.params);

  const { role } = request.user;
  const userId = request.user.sub;

  const { job, departmentDetails, requesterJobEmail } =
    await TransferDepartmentJobUseCase({
      jobId,
      departmentId,
      userId,
      role,
    });

  const mail = await getMailClient();

  await Promise.all(
    departmentDetails.responsables.map(async (responsable) => {
      const jobLink = `${env.WEB_URL}/servico/${job.id}`;

      const message = await mail.sendMail({
        from: {
          name: 'Gerenciador de Serviços',
          address: 'no-reply@cinbal.com.br',
        },
        to: responsable.email,
        subject: `Requisição de serviço direcionada: `,
        html: `
              <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                <p>Olá, recebemos uma nova requição de serviço: </strong></p>
                <p></p>
                <p>Sua solicitação foi transferida para o departamento:</p>
                <p>${job.department.name}</p>
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
        bcc: [requesterJobEmail],
      });

      console.log(nodemailer.getTestMessageUrl(message));
    }),
  );

  return { job: job };
};

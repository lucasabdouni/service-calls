import { env } from '@/env';
import { getMailClient } from '@/lib/mail';
import { TransferDepartmentServiceUseCase } from '@/use-cases/transfer-department-service';
import { FastifyRequest } from 'fastify';
import nodemailer from 'nodemailer';
import z from 'zod';

const bodySchema = z.object({
  departmentId: z
    .string({ message: 'Department is mandatory' })
    .uuid({ message: 'Department id is invalid' }),
});

const paramsSchema = z.object({
  serviceId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const transferDepartmentServiceHandler = async (
  request: FastifyRequest,
) => {
  const { departmentId } = bodySchema.parse(request.body);
  const { serviceId } = paramsSchema.parse(request.params);

  const { role } = request.user;
  const userId = request.user.sub;

  const { service, departmentDetails, requesterServiceEmail } =
    await TransferDepartmentServiceUseCase({
      serviceId,
      departmentId,
      userId,
      role,
    });

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
        subject: `Requisição de serviço direcionada: ${service.problem}`,
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
        bcc: [requesterServiceEmail],
      });

      console.log(nodemailer.getTestMessageUrl(message));
    }),
  );

  return { service: service };
};

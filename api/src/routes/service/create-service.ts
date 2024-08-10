import { env } from '@/env';
import { ClientError } from '@/errors/client-erro';
import { getMailClient } from '@/lib/mail';
import { createService } from '@/repositories/service-repository';
import {
  getUserById,
  getUserResponsable,
} from '@/repositories/user-repository';
import { CheckResponsableFromDepartment } from '@/utils/check-responsable';
import { FastifyRequest } from 'fastify';
import nodemailer from 'nodemailer';
import z from 'zod';
import { Department } from './../../repositories/service-repository';

const DepartmentEnumSchema = z.enum([
  Department.ELECTRICAL,
  Department.MECANIC,
  Department.SG,
  Department.TI,
]);

const PriorityEnum = z.enum(['Baixa', 'Media', 'Alta']);

const bodySchema = z.object({
  department: DepartmentEnumSchema,
  local: z.string({ message: 'Local is mandatory' }),
  problem: z.string({ message: 'Problem is mandatory' }),
  problem_description: z.string({
    message: 'Description of the problem pro is mandatory',
  }),
  priority: PriorityEnum,
});

export const createServiceHandler = async (request: FastifyRequest) => {
  const { department, local, problem, problem_description, priority } =
    bodySchema.parse(request.body);

  const user = await getUserById(request.user.sub);

  if (!user) throw new ClientError(409, 'User not found.');

  const data = {
    department,
    local,
    problem,
    problem_description,
    priority,
    user_id: user.id,
  };

  const service = await createService(data);

  const responsableRules = CheckResponsableFromDepartment(department);

  const responsables = await getUserResponsable(responsableRules);

  const mail = await getMailClient();

  await Promise.all(
    responsables.map(async (responsable) => {
      const serviceLink = `${env.WEB_URL}/servico/${service.id}`;

      const message = await mail.sendMail({
        from: {
          name: 'Gerenciador de Serviços',
          address: 'oi@service.com.br',
        },
        to: responsable.email,
        subject: `Nova requisição de serviço cadastrada: ${service.problem}`,
        html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Olá, recemos uma nova requição de serviço: <strong>${service.problem}</strong></p>
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

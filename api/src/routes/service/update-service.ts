import { env } from '@/env';
import { ClientError } from '@/errors/client-erro';
import { getMailClient } from '@/lib/mail';
import {
  getServiceById,
  updateService,
} from '@/repositories/service-repository';
import { Role, getUserResponsable } from '@/repositories/user-repository';
import { CheckDepartmentFromRoles } from '@/utils/check-department';
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
  department: DepartmentEnumSchema.optional(),
  local: z.string().optional(),
  problem: z.string().optional(),
  problem_description: z.string().optional(),
  priority: PriorityEnum.optional(),
  occurs_at: z.coerce.date().optional(),
  responsible_accomplish: z.string().optional(),
  status: z.string().optional(),
});

const paramsSchema = z.object({
  serviceId: z
    .string({ message: 'Id is invalid' })
    .uuid({ message: 'Id is invalid' }),
});

export const updateServiceHandler = async (request: FastifyRequest) => {
  const data = bodySchema.parse(request.body);
  const { serviceId } = paramsSchema.parse(request.params);
  const { role } = request.user;

  const checkServiceExists = await getServiceById(serviceId);
  if (!checkServiceExists) {
    throw new ClientError(409, 'Service not found.');
  }

  const departmentCheck = CheckDepartmentFromRoles(role);
  if (role !== Role.ADMIN) {
    throw new ClientError(
      409,
      'User not authorized to update this department.',
    );
  }

  if (
    role !== Role.ADMIN &&
    checkServiceExists.department !== departmentCheck
  ) {
    throw new ClientError(
      409,
      'User not authorized to update this department.',
    );
  }

  const service = await updateService({ id: serviceId, data });

  if (data.department && data.department !== checkServiceExists.department) {
    const responsableRules = CheckResponsableFromDepartment(data.department);

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
  }

  return { service };
};

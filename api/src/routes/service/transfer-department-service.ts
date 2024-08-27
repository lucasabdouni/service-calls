import { env } from '@/env';
import { ClientError } from '@/errors/client-erro';
import { getMailClient } from '@/lib/mail';
import { getDepartmentById } from '@/repositories/department-respository';
import {
  getServiceById,
  updateServiceDepartment,
} from '@/repositories/service-repository';
import { Role } from '@/repositories/user-repository';
import { FastifyRequest } from 'fastify';
import nodemailer from 'nodemailer';
import z from 'zod';

const bodySchema = z.object({
  department_id: z
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
  const data = bodySchema.parse(request.body);
  const { serviceId } = paramsSchema.parse(request.params);

  const { role } = request.user;
  const userId = request.user.sub;

  const checkServiceExists = await getServiceById(serviceId);
  if (!checkServiceExists) {
    throw new ClientError(409, 'Service not found.');
  }

  if (data.department_id === checkServiceExists.department.id) {
    throw new ClientError(409, 'Service already belongs to this department.');
  }

  const departmentCheck = await getDepartmentById(
    checkServiceExists.department.id,
  );

  const checkUserIsResponsibleDepartment = departmentCheck?.responsables.some(
    (item) => item.id === userId,
  );

  if (role !== Role.ADMIN && !checkUserIsResponsibleDepartment) {
    throw new ClientError(
      403,
      'User not authorized to update this department.',
    );
  }

  const departmentDetails = await getDepartmentById(data.department_id);

  if (!departmentDetails) {
    throw new ClientError(409, 'New department not found.');
  }

  const service = await updateServiceDepartment({ id: serviceId, data });

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
        subject: `Nova requisição de serviço direcionada: ${service.problem}`,
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

  return { service: service };
};

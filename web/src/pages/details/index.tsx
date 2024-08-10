import { useContext, useEffect, useState } from 'react';

import { Popconfirm, Skeleton } from 'antd';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCheck, SquarePen, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import Layout from '../../components/layout';
import Loading from '../../components/loading';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../lib/axios';
import { ServiceProps } from '../dashboard/services-user-table';
import { EditServiceModal } from './edit-service-modal';

const priorityVariants = tv({
  base: 'text-3xl',
  variants: {
    priority: {
      Baixa: 'text-green-500',
      Media: 'text-yellow-400',
      Alta: 'text-red-500',
    },
  },
});

export default function Details() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { loading, user } = useContext(AuthContext);
  const [serviceIsLoading, setServiceIsLoading] = useState(false);
  const [service, setService] = useState<ServiceProps>();
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);

  async function handleDeleteService() {
    try {
      await api.delete(`/service/${serviceId}`);

      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
  }

  async function handleConfirmAccomplishedService() {
    try {
      await api.get(`/accomplished/${serviceId}`);

      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
  }

  function changeEditServiceModal() {
    setIsEditServiceModalOpen(!isEditServiceModalOpen);
  }

  useEffect(() => {
    async function getServices() {
      try {
        if (!loading && user) {
          setServiceIsLoading(true);
          const response = await api.get(`/service/${serviceId}`);
          setService(response.data.service);
        }
      } catch (error) {
        navigate('/dashboard');
      } finally {
        setServiceIsLoading(false);
      }
    }

    getServices();
  }, [loading, user, serviceId]);

  if (loading) {
    return <Loading />;
  }

  const serviceTeminated = service?.status === 'Finalizado' ? true : false;

  const dateCreate = service
    ? format(service.created_at, 'dd/MM/yyyy', {
        locale: ptBR,
      })
    : null;

  const dateOccurs = service?.occurs_at
    ? format(service.occurs_at, 'dd/MM/yyyy', {
        locale: ptBR,
      })
    : null;

  return (
    <Layout>
      {serviceIsLoading ? (
        <Skeleton active />
      ) : (
        <div className="w-full h-full max-w-6xl flex flex-col items-center justify-center gap-12 p-3">
          <div className="flex flex-col w-full bg-white gap-4 p-14">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">Serviço</p>
                <h2 className="text-4xl font-semibold">
                  {service?.problem.toUpperCase()}
                </h2>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">Prioridade</p>
                <span
                  className={priorityVariants({
                    priority: service?.priority as 'Baixa' | 'Media' | 'Alta',
                  })}
                >
                  ● {service?.priority}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">Descrição</p>
              <span className="text-2xl">{service?.problem_description}</span>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">Departamento responsável</p>
              <span className="text-2xl">{service?.department}</span>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">Local</p>
              <span className="text-2xl">{service?.local}</span>
            </div>

            <div className="flex gap-8 items-center">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">Status</p>
                <span className="text-2xl">{service?.status}</span>
              </div>

              <div className="h-10 w-[1px] bg-gray-300" />

              <div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Data de solicitação</p>
                  <span className="text-2xl">{dateCreate}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-8 items-center">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                  Data prevista para execução
                </p>
                <span className="text-2xl">
                  {dateOccurs ? dateOccurs : '-- / -- / --'}
                </span>
              </div>

              <div className="h-10 w-[1px] bg-gray-300" />

              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                  Responsavel pela execução
                </p>
                <span className="text-2xl">
                  {service?.responsible_accomplish
                    ? service.responsible_accomplish
                    : 'Não definido'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                className="flex items-center justify-center gap-2 bg-orange-500 p-2 text-zinc-100 hover:bg-orange-700 disabled:bg-orange-300"
                disabled={serviceTeminated}
                onClick={changeEditServiceModal}
              >
                <SquarePen />
                Responder a solicitação
              </button>

              <div className="flex gap-2">
                <Popconfirm
                  title="Tem certeza que deseja deletar?"
                  onConfirm={() => handleDeleteService()}
                  okText="Sim"
                  cancelText="Não"
                >
                  <button
                    className="flex items-center justify-center gap-2 bg-red-500 p-2 text-zinc-100 hover:bg-red-700 disabled:bg-red-400"
                    disabled={serviceTeminated}
                  >
                    <Trash2 className="size-4" /> Deletar
                  </button>
                </Popconfirm>

                <Popconfirm
                  title="Você tem certeza que o serviço foi realizado?"
                  onConfirm={handleConfirmAccomplishedService}
                  okText="Sim"
                  cancelText="Não"
                >
                  <button
                    className="flex items-center justify-center gap-2 bg-green-400 p-2 text-zinc-100 hover:bg-green-600 disabled:bg-green-300"
                    disabled={serviceTeminated}
                  >
                    <CheckCheck />
                    Realizado
                  </button>
                </Popconfirm>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditServiceModalOpen && service && (
        <EditServiceModal
          setService={setService}
          changeEditServiceModal={changeEditServiceModal}
          service={service}
        />
      )}
    </Layout>
  );
}

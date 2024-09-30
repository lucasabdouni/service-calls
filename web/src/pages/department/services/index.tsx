import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Popconfirm, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { ArrowDown, Pencil, Plus, Trash2 } from 'lucide-react';
import { useContext, useState } from 'react';
import { deleteService } from '../../../api/delete-service';
import {
  getServicesByDepartment,
  GetServicesByDepartmentResponse,
} from '../../../api/get-service-by-department';
import { notify } from '../../../components/notification';
import { Skeleton } from '../../../components/skeleton';
import { AuthContext } from '../../../context/AuthContext';
import { ServiceProps } from '../../../types/services';
import { CreateServiceModal } from './create-service-modal';
import { EditServiceModal } from './edit-service-modal';

export default function ServicesDepartment() {
  const { user } = useContext(AuthContext);

  const queryClient = useQueryClient();

  function updateServiceOnCache(jobId: string) {
    const servicesListCache =
      queryClient.getQueriesData<GetServicesByDepartmentResponse>({
        queryKey: ['services', selectedDepartment],
      });

    servicesListCache.forEach(([cacheKey, cacheData]) => {
      if (!cacheData) {
        return;
      }

      const updateService = cacheData.filter((service) => service.id !== jobId);

      queryClient.setQueryData<GetServicesByDepartmentResponse>(
        cacheKey,
        updateService,
      );

      return updateService;
    });
  }

  const [selectedService, setSelectedService] = useState<ServiceProps | null>(
    null,
  );

  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    user.departments_responsible?.[0]?.id || '',
  );

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['services', selectedDepartment],
    queryFn: () =>
      getServicesByDepartment({ departmentId: selectedDepartment }),
    enabled: !!selectedDepartment,
  });

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
  };

  const [isCreateServiceModalOpen, setIsCreateServiceModalOpen] =
    useState(false);

  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);

  function changeCreateServiceModal() {
    setIsCreateServiceModalOpen(!isCreateServiceModalOpen);
  }

  function changeEditServiceModal() {
    setIsEditServiceModalOpen(!isEditServiceModalOpen);
  }

  function openModalEditService(service: ServiceProps) {
    setSelectedService(service);
    changeEditServiceModal();
  }

  const { mutateAsync: deleteJobFn } = useMutation({
    mutationFn: deleteService,
    onSuccess: (_, { serviceId }) => {
      updateServiceOnCache(serviceId);
    },
  });

  function handleDeleteService(serviceId: string) {
    try {
      deleteJobFn({ serviceId });

      notify({
        type: 'success',
        message: 'Deletado com sucesso.',
        description: 'O serviço foi deletado com sucesso.',
      });
    } catch {
      notify({
        type: 'error',
        message: 'Erro na requisição.',
        description: 'Tente novamente mais tarde.',
      });
    }
  }

  const columns: ColumnType<GetServicesByDepartmentResponse[number]>[] = [
    {
      title: (
        <span className="flex text-xs items-center justify-center gap-2 text-zinc-500 font-light">
          Nome <ArrowDown className="size-4 text-zinc-400" />
        </span>
      ),
      dataIndex: ['name'],
      key: 'name',
      className: 'font-semibold',
      width: '20%',
      align: 'center',
      render: (text: string) => (
        <span className="block truncate max-w-24">{text}</span>
      ),
    },
    {
      title: (
        <span className="flex text-xs items-center justify-center gap-2 text-zinc-500 font-light">
          Descrição <ArrowDown className="size-4 text-zinc-400" />
        </span>
      ),
      dataIndex: ['description'],
      key: 'description',
      className: 'font-semibold',
      width: '40%',
      render: (text: string) => <span className="block truncate">{text}</span>,
    },
    {
      title: (
        <span className="flex text-xs items-center justify-center gap-2 text-zinc-500 font-light">
          Local <ArrowDown className="size-4 text-zinc-400" />
        </span>
      ),
      dataIndex: 'execution_time',
      key: 'execution_time',
      className: 'font-semibold',
      width: '12%',
      render: (text: number) => (
        <span className="block truncate max-w-28">
          {Math.floor(text / 1000 / 60)} min.
        </span>
      ),
    },
    {
      key: 'actions',
      width: '5%',
      render: (record: GetServicesByDepartmentResponse[number]) => (
        <div className="flex items-center justify-center gap-3">
          <Popconfirm
            title="Tem certeza que deseja deletar?"
            onConfirm={() => handleDeleteService(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <button>
              <Trash2 className="size-5" />
            </button>
          </Popconfirm>

          <button onClick={() => openModalEditService(record)}>
            <Pencil className="size-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="w-full h-full max-w-6xl flex flex-col items-center justify-center gap-12 p-3">
        <section className="w-full overflow-x-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-3">
            <button
              onClick={changeCreateServiceModal}
              className="flex bg-[#000AFF] text-zinc-50 justify-center items-center py-2 w-full md:w-40 rounded-lg text-sm gap-2 hover:bg-blue-700"
            >
              <Plus className="size-4 text-white" />
              Novo serviço
            </button>

            <select
              id="department"
              className="w-max p-1 bg-zinc-300"
              disabled={isLoadingServices}
              value={selectedDepartment || ''}
              onChange={handleDepartmentChange}
            >
              <option value="" disabled>
                Selecione um departamento
              </option>

              {user.departments_responsible &&
                user.departments_responsible.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
            </select>
          </div>
          {isLoadingServices ? (
            <div className="flex flex-col w-full items-center justify-center mt-2">
              <div className="w-full h-64">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    className="flex items-center justify-center px-2 py-[1px]"
                    key={i}
                  >
                    <Skeleton className="w-full h-10" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {services && services.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={services}
                  rowKey="id"
                  pagination={{ pageSize: 6, position: ['bottomCenter'] }}
                  className="bg-white rounded-xl mt-3"
                  scroll={{ x: true }}
                />
              ) : (
                <p className="text-center text-lg text-zinc-500 mt-28">
                  Não há serviços cadastrados no departamento.
                </p>
              )}
            </>
          )}
        </section>
      </div>

      {isCreateServiceModalOpen && (
        <CreateServiceModal
          changeServiceModal={changeCreateServiceModal}
          departmentId={selectedDepartment}
        />
      )}

      {isEditServiceModalOpen && selectedService && (
        <EditServiceModal
          departmentId={selectedDepartment}
          service={selectedService}
          changeServiceModal={changeEditServiceModal}
        />
      )}
    </>
  );
}

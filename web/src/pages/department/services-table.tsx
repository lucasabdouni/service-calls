import { Popconfirm, Table } from 'antd';
import { ptBR } from 'date-fns/locale';
import {
  ArrowDown,
  CalendarFold,
  Search,
  SquareArrowOutUpRight,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import { tv } from 'tailwind-variants';

export interface ServiceProps {
  id: string;
  department: string;
  local: string;
  problem: string;
  problem_description: string;
  priority: string;
  status: string;
  occurs_at?: Date | null;
  responsible_accomplish?: string | null;
  accomplished: boolean;
  created_at: string;
  user_id: string;
}

interface ServicesByUserProps {
  data: ServiceProps[];
  handleDeleteService: (id: string) => void;
  handleFilteredServices: (
    startsDate: Date | null,
    endsDate: Date | null,
    checkedAccomplished: boolean,
  ) => void;
  serviceFilterIsLoading: boolean;
}

const priorityVariants = tv({
  base: 'font-semibold',
  variants: {
    priority: {
      Baixa: 'text-green-500',
      Media: 'text-yellow-400',
      Alta: 'text-red-500',
    },
  },
});

export const ServicesTable: React.FC<ServicesByUserProps> = ({
  data,
  handleDeleteService,
  handleFilteredServices,
  serviceFilterIsLoading = false,
}) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  const [checkedServiceAccomplished, setCheckedServiceAccomplished] =
    useState(false);
  const [searchText, setSearchText] = useState('');

  const priorities =
    data &&
    [...new Set(data.map((item) => item.priority))].map((priority) => ({
      text: priority,
      value: priority,
    }));

  const departamentos =
    data &&
    [...new Set(data.map((item) => item.department))].map((department) => ({
      text: department,
      value: department,
    }));

  const columns = [
    {
      title: (
        <span className="flex text-xs items-center justify-center gap-2 text-zinc-500 font-light">
          Serviço <ArrowDown className="size-4 text-zinc-400" />
        </span>
      ),
      dataIndex: 'problem',
      key: 'problem',
      className: 'font-semibold',
      width: '10%',
      align: 'center',
    },
    {
      title: (
        <span className="flex text-xs items-center justify-center gap-2 text-zinc-500 font-light">
          Departamento <ArrowDown className="size-4 text-zinc-400" />
        </span>
      ),
      dataIndex: 'department',
      key: 'department',
      className: 'font-semibold',
      filters: departamentos,
      width: '10%',
      align: 'center',
      onFilter: (value: string, record: ServiceProps) =>
        record.department === value,
    },
    {
      title: (
        <span className="flex text-xs items-center justify-center gap-2 text-zinc-500 font-light">
          Local <ArrowDown className="size-4 text-zinc-400" />
        </span>
      ),
      dataIndex: 'local',
      key: 'local',
      className: 'font-semibold',
      width: '10%',
    },
    {
      title: (
        <span className="flex text-xs items-center justify-center gap-2 text-zinc-500 font-light">
          Descrição do serviço <ArrowDown className="size-4 text-zinc-400" />
        </span>
      ),
      dataIndex: 'problem_description',
      key: 'problem_description',
      className: 'font-semibold',
      ellipsis: true,
      width: 'auto',
    },
    {
      title: (
        <span className="flex text-xs items-center justify-center gap-2 text-zinc-500 font-light">
          Prioridade <ArrowDown className="size-4 text-zinc-400" />
        </span>
      ),
      key: 'priority',
      render: (record: ServiceProps) => {
        return (
          <span
            className={priorityVariants({
              priority: record.priority as 'Baixa' | 'Media' | 'Alta',
            })}
          >
            ● {record.priority}
          </span>
        );
      },
      filters: priorities,
      width: '10%',
      align: 'center',
      onFilter: (value: string, record: ServiceProps) =>
        record.priority === value,
    },
    {
      title: (
        <span className="flex text-xs items-center justify-center gap-2 text-zinc-500 font-light">
          Status <ArrowDown className="size-4 text-zinc-400" />
        </span>
      ),
      dataIndex: 'status',
      key: 'status',
      className: 'font-semibold',
      width: '18%',
      align: 'center',
    },
    {
      key: 'actions',
      width: '10%',
      render: (record: ServiceProps) => (
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

          <Link to={`/servico/${record.id}`}>
            <SquareArrowOutUpRight className="size-5" />
          </Link>
        </div>
      ),
    },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredData =
    data &&
    data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase()),
      ),
    );

  return (
    <section className="w-full">
      {data && data.length > 0 ? (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex gap-5 items-center">
              <div className="flex flex-col gap-4 items-center sm:flex-row">
                <div>
                  <span className="text-zinc-400 text-sm">
                    Filtrar uma data especifica:
                  </span>

                  <div className="flex gap-2 bg-zinc-100 border-[2px] border-zinc-300 text-zinc-400 rounded-lg p-2 text-sm">
                    <DatePicker
                      className="bg-transparent w-48 placeholder:text-zinc-400"
                      locale={ptBR}
                      dateFormat="P"
                      selectsRange
                      startDate={startDate || undefined}
                      endDate={endDate || undefined}
                      onChange={(update) => {
                        setDateRange(update);
                      }}
                      maxDate={new Date()}
                      placeholderText="Selecione o período"
                      disabled={serviceFilterIsLoading}
                    />

                    <CalendarFold className="size-4" />
                  </div>
                </div>

                <div className="flex md:flex-col lg:flex-row gap-2 justify-center items-start">
                  <div className="flex justify-center items-center gap-1">
                    <input
                      type="checkbox"
                      id="finalized"
                      checked={checkedServiceAccomplished}
                      onChange={(event) => {
                        setCheckedServiceAccomplished(event?.target.checked);
                      }}
                      disabled={serviceFilterIsLoading}
                    />
                    <label
                      htmlFor="finalized"
                      className="text-zinc-500 text-sm"
                    >
                      Serviços finalizados
                    </label>
                  </div>

                  <button
                    className="bg-green-400 text-sm h-6 px-5 rounded-lg hover:bg-green-500"
                    onClick={() =>
                      handleFilteredServices(
                        startDate,
                        endDate,
                        checkedServiceAccomplished,
                      )
                    }
                  >
                    {!serviceFilterIsLoading ? (
                      'Filtrar'
                    ) : (
                      <svg
                        aria-hidden="true"
                        className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex text-sm p-2 bg-white rounded-lg border-[2px] gap-2 w-full md:w-auto">
              <Search className="size-5 text-zinc-400" />
              <input
                type="text"
                className="bg-none placeholder:text-zinc-400"
                placeholder="Buscar serviço"
                value={searchText}
                onChange={handleSearch}
              />
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 6, position: ['bottomCenter'] }}
            className="bg-white rounded-xl mt-3"
            scroll={{ x: true }}
          />
        </>
      ) : (
        <p className="text-center text-lg text-zinc-500">
          Não a serviços solicitados.
        </p>
      )}
    </section>
  );
};

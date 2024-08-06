import { Popconfirm, Table } from 'antd';
import {
  ArrowDown,
  Plus,
  Search,
  SquareArrowOutUpRight,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
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

export const ServicesByUser: React.FC<ServicesByUserProps> = ({
  data,
  handleDeleteService,
}) => {
  const [searchText, setSearchText] = useState('');

  const priorities = [...new Set(data.map((item) => item.priority))].map(
    (priority) => ({
      text: priority,
      value: priority,
    }),
  );

  const departamentos = [...new Set(data.map((item) => item.department))].map(
    (department) => ({
      text: department,
      value: department,
    }),
  );

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
    },
    {
      key: 'actions',
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

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase()),
    ),
  );

  return (
    <section className="w-full">
      {data.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <Link
              to="/cadastrar-servico"
              className="flex bg-[#000AFF] text-zinc-50 justify-center items-center py-2 w-40 rounded-lg text-sm gap-2 hover:bg-blue-700"
            >
              <Plus className="size-4 text-white" />
              Novo serviço
            </Link>

            <div className="flex text-sm p-2 bg-white rounded-lg border-[2px] gap-2">
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
            pagination={{ pageSize: 6 }}
            className="bg-white rounded-xl mt-3"
          />
        </>
      ) : (
        <p className="text-lg text-zinc-500">
          Ainda não a serviços solicitados.
        </p>
      )}
    </section>
  );
};

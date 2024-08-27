import { Popconfirm, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
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
import { ServiceProps } from '../../types/services';

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

export const ServicesTable: React.FC<ServicesByUserProps> = ({
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

  const departamentos = [
    ...new Set(data.map((item) => item.department.name)),
  ].map((department) => ({
    text: department,
    value: department,
  }));

  const columns: ColumnType<ServiceProps>[] = [
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
      render: (text: string) => (
        <span className="block truncate max-w-24">{text}</span>
      ),
    },
    {
      title: (
        <span className="flex text-xs items-center justify-center gap-2 text-zinc-500 font-light">
          Departamento <ArrowDown className="size-4 text-zinc-400" />
        </span>
      ),
      dataIndex: 'department',
      key: 'department.name',
      className: 'font-semibold',
      filters: departamentos,
      width: '10%',
      onFilter: (value, record: ServiceProps) =>
        record.department.name === (value as string),
      render: (_, record) => (
        <span className="block truncate max-w-24">
          {record.department.name}
        </span>
      ),
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
      width: '12%',
      render: (text: string) => (
        <span className="block truncate max-w-28">{text}</span>
      ),
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
      render: (text: string) => (
        <span className="block truncate max-w-60">{text}</span>
      ),
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
      onFilter: (value, record: ServiceProps) =>
        record.priority === (value as string),
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
      width: '20%',
      align: 'center',
    },
    {
      key: 'actions',
      width: '5%',
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
    <section className="w-full overflow-x-auto">
      {data.length > 0 ? (
        <>
          <div className="flex flex-col md:flex-row items-end justify-between gap-3">
            <Link
              to="/cadastrar-servico"
              className="flex bg-[#000AFF] text-zinc-50 justify-center items-center py-2 w-full md:w-40 rounded-lg text-sm gap-2 hover:bg-blue-700"
            >
              <Plus className="size-4 text-white" />
              Novo serviço
            </Link>

            <div className="flex text-sm p-2 bg-white rounded-lg border-[2px] gap-2 w-full md:w-auto">
              <Search className="size-5 text-zinc-400" />
              <input
                type="text"
                className="bg-none placeholder:text-zinc-400 w-full md:w-auto"
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
          Ainda não a serviços solicitados.
        </p>
      )}
    </section>
  );
};

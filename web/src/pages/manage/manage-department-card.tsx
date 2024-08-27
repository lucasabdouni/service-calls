import { useState } from 'react';
import { Button } from '../../components/button';
import { CreateDepartmentModal } from './manage-department-modal';

export default function ManageDeparmentCard() {
  const [isCreateDepartmentModalOpen, setIsCreateDepartmentModalOpen] =
    useState(false);

  function changeDepartmentModal() {
    setIsCreateDepartmentModalOpen(!isCreateDepartmentModalOpen);
  }

  return (
    <>
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md">
        <h1 className="text-lg sm:text-2xl font-bold text-title">
          Gerenciar departamentos
        </h1>

        <p className="text-zinc-500 text-sm sm:text-base">
          Criar, editar e excluir.
        </p>

        <Button type="button" onClick={changeDepartmentModal} className="mt-4">
          Criar departamento
        </Button>
      </div>

      {isCreateDepartmentModalOpen && (
        <CreateDepartmentModal changeDepartmentModal={changeDepartmentModal} />
      )}
    </>
  );
}

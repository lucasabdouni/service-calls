import { useState } from 'react';
import { Button } from '../../components/button';
import { CreateDepartmentModal } from './create-department-modal';
import { EditDepartmentModal } from './edit-department-modal';

export default function ManageDeparmentCard() {
  const [isCreateDepartmentModalOpen, setIsCreateDepartmentModalOpen] =
    useState(false);

  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] =
    useState(false);

  function changeCreateDepartmentModal() {
    setIsCreateDepartmentModalOpen(!isCreateDepartmentModalOpen);
  }

  function changeEditDepartmentModal() {
    setIsEditDepartmentModalOpen(!isEditDepartmentModalOpen);
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

        <Button
          type="button"
          onClick={changeCreateDepartmentModal}
          className="mt-4"
        >
          Criar departamento
        </Button>

        <Button
          variant="secondary"
          type="button"
          onClick={changeEditDepartmentModal}
          className="mt-4"
        >
          Editar departamento
        </Button>
      </div>

      {isCreateDepartmentModalOpen && (
        <CreateDepartmentModal
          changeDepartmentModal={changeCreateDepartmentModal}
        />
      )}

      {isEditDepartmentModalOpen && (
        <EditDepartmentModal
          isOpen={isEditDepartmentModalOpen}
          changeDepartmentModal={changeEditDepartmentModal}
        />
      )}
    </>
  );
}

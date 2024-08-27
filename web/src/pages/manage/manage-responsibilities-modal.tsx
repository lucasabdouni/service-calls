import { CircleX, SendHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { notify } from '../../components/notification';
import { api } from '../../lib/axios';
import { DepartmentProps } from '../../types/department';
import { UserProps } from '../../types/user';

interface CreateLinkModalProps {
  changeManageResponsibilitiesModal: () => void;
  userSearch: UserProps;
  setUserSearch: React.Dispatch<React.SetStateAction<UserProps | undefined>>;
}

export function ManageResponsibilitiesModal({
  changeManageResponsibilitiesModal,
  userSearch,
  setUserSearch,
}: CreateLinkModalProps) {
  const [departments, setDepartments] = useState<DepartmentProps[]>([]);
  const [userDepartments, setUserDepartments] = useState<DepartmentProps[]>(
    userSearch.departments_responsible,
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [addDepartmentsIds, setAddDepartmentsIds] = useState<string[]>([]);
  const [removeDepartmentsIds, setRemoveDepartmentsIds] = useState<string[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDepartments() {
      try {
        const response = await api.get(`/departments`);

        const deparments = response.data?.departments.filter(
          (department: DepartmentProps) =>
            !userSearch.departments_responsible.some(
              (existingDept) => existingDept.id === department.id,
            ),
        );

        setDepartments(deparments);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getDepartments();
  }, [userSearch.departments_responsible]);

  function handleAddDepartmentsIds() {
    setAddDepartmentsIds([...addDepartmentsIds, selectedDepartmentId]);

    const newDepartment = departments.find(
      (item) => item.id === selectedDepartmentId,
    );

    if (
      newDepartment &&
      !userDepartments.some((item) => item.id === newDepartment.id)
    ) {
      setUserDepartments([...userDepartments, newDepartment]);

      const departmentList = departments.filter(
        (department: DepartmentProps) => department.id !== newDepartment.id,
      );

      setDepartments(departmentList);

      if (removeDepartmentsIds.some((item) => item === newDepartment.id)) {
        setRemoveDepartmentsIds(
          removeDepartmentsIds.filter((item) => item !== newDepartment.id),
        );
      }
    }
  }

  function handleRemoveDepartmentsIds(dept: DepartmentProps) {
    setRemoveDepartmentsIds([...removeDepartmentsIds, dept.id]);
    setUserDepartments(
      userDepartments.filter((department) => department.id !== dept.id),
    );

    setDepartments([...departments, dept]);

    if (addDepartmentsIds.some((item) => item === dept.id)) {
      setAddDepartmentsIds(
        addDepartmentsIds.filter((item) => item !== dept.id),
      );
    }
  }

  async function handleUpdateResponsibilitesUser() {
    try {
      await api.put(`/user/${userSearch.id}/update-departments-responsable`, {
        addDepartmentsIds,
        removeDepartmentsIds,
      });

      notify({
        type: 'success',
        message: 'Alterações realizadas com sucesso.',
        description: 'As mudanças foram aplicadas com sucesso.',
      });

      setUserSearch((prevUser) => {
        if (!prevUser) return prevUser;

        return {
          ...prevUser,
          departments_responsible: userDepartments,
        };
      });

      changeManageResponsibilitiesModal();
    } catch (err) {
      notify({
        type: 'error',
        message: 'Erro na solicitação.',
        description:
          'Houve um problema durante a solicitação. Tente novamente mais tarde.',
      });
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-2">
      <div className="w-[640px] min-h-96 rounded-lg py-5 px-6 shadow-shape bg-white space-y-5 flex flex-col">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Gerenciar departamentos de responsabilidades:
            </h2>
            <button onClick={changeManageResponsibilitiesModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
        </div>

        <ul className="flex flex-wrap gap-2 flex-1">
          {userDepartments.map((deparment) => {
            return (
              <li
                key={deparment.id}
                className="inline-flex h-8 bg-zinc-200 gap-1 items-center pr-2 rounded-lg"
              >
                <button
                  className="p-2"
                  onClick={() => {
                    handleRemoveDepartmentsIds(deparment);
                  }}
                >
                  <CircleX className="size-5 text-red-500" />
                </button>
                <p className="text-zinc-500 sm:text-base text-sm">
                  {deparment.sigla} - {deparment.name}
                </p>
              </li>
            );
          })}
        </ul>

        <form
          className="flex flex-col gap-2 mt-8 border-t-[1px] border-gray-300 pt-2"
          onSubmit={() => {}}
        >
          <label
            htmlFor=""
            className="flex items-center gap-2 font-semibold text-zinc-700"
          >
            Selecione o departamento que deseja incluir:
          </label>
          <div className="flex w-full gap-2">
            <select
              id="department"
              className="w-max flex-1 bg-gray-200 px-2 hover:bg-gray-300"
              disabled={loading}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              value={selectedDepartmentId}
            >
              <option className="flex" value="" disabled>
                {loading ? 'Carregando...' : 'Selecione'}
              </option>

              {departments &&
                departments.map((department) => {
                  return (
                    <option key={department.id} value={department.id}>
                      {department.sigla} - {department.name}
                    </option>
                  );
                })}
            </select>

            <button
              className="bg-blue-500 text-white p-2 rounded-lg text-sm sm:text-base hover:bg-blue-700"
              type="button"
              onClick={handleAddDepartmentsIds}
            >
              Incluir
            </button>

            <button
              className="border-[1px bg-green-500 px-2 rounded-lg hover:bg-green-700"
              onClick={handleUpdateResponsibilitesUser}
              type="button"
            >
              <SendHorizontal className="size-5 text-gray-100" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

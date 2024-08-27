import { useContext, useEffect, useState } from 'react';

import Loading from '../../components/loading';
import { notify } from '../../components/notification';
import { Statistics } from '../../components/statistics';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../lib/axios';
import { ServiceProps } from '../../types/services';
import { ServicesTable } from './services-user-table';

export default function Dashboard() {
  const { loading, user } = useContext(AuthContext);
  const [serviceIsLoading, setServiceIsLoading] = useState(false);
  const [services, setServices] = useState<ServiceProps[]>([]);

  async function handleDeleteService(id: string) {
    try {
      await api.delete(`/service/${id}`);

      notify({
        type: 'success',
        message: 'Deletado com sucesso.',
        description: 'O serviço foi deletado com sucesso.',
      });

      setServices(services.filter((s) => s.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function getServices() {
      try {
        if (!loading && user) {
          setServiceIsLoading(true);
          const response = await api.get(`/services/user/${user.id}`);
          setServices(response.data.services);
          console.log(services);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setServiceIsLoading(false);
      }
    }

    getServices();
  }, [loading, user]);

  if (loading) {
    return <Loading />;
  }

  const requestsNumber = services.length;
  const openRequest = services.filter(
    (item) => item.accomplished === false,
  ).length;
  const completedRequest = services.filter(
    (item) => item.accomplished === true,
  ).length;

  return (
    <>
      {serviceIsLoading ? (
        <Loading />
      ) : (
        <div className="w-full h-full max-w-6xl flex flex-col items-center justify-center gap-12 p-3">
          <Statistics
            openRequest={openRequest}
            requests={requestsNumber}
            completedRequest={completedRequest}
          />
          <ServicesTable
            data={services}
            handleDeleteService={handleDeleteService}
          />
        </div>
      )}
    </>
  );
}

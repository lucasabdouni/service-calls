import { useContext, useEffect, useState } from 'react';

import Loading from '../../components/loading';
import { notify } from '../../components/notification';
import { Statistics } from '../../components/statistics';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../lib/axios';
import { ServiceProps } from '../../types/services';
import { ServicesTable } from './services-table';

export default function Department() {
  const { loading, user } = useContext(AuthContext);
  const [serviceIsLoading, setServiceIsLoading] = useState(false);
  const [serviceFilterIsLoading, setServiceFilterIsLoading] = useState(false);
  const [service, setService] = useState<ServiceProps[]>([]);

  async function handleDeleteService(id: string) {
    try {
      await api.delete(`/service/${id}`);

      notify({
        type: 'success',
        message: 'Deletado com sucesso.',
        description: 'O serviço foi deletado com sucesso.',
      });

      setService(service.filter((s) => s.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  async function handleFilteredServices(
    startsDate: Date | null,
    endsDate: Date | null,
    checkedAccomplished: boolean,
  ) {
    try {
      setServiceFilterIsLoading(true);
      const queryParams = {
        starts_at: startsDate ? startsDate.toISOString().slice(0, 10) : null,
        ends_at: endsDate ? endsDate.toISOString().slice(0, 10) : null,
        accomplished: checkedAccomplished,
      };

      const response = await api.get('/services', {
        params: queryParams,
      });
      setService(response.data.services);
    } catch (error) {
      console.log(error);
    } finally {
      setServiceFilterIsLoading(false);
    }
  }

  useEffect(() => {
    async function getServices() {
      try {
        if (!loading && user) {
          setServiceIsLoading(true);
          const response = await api.get(`/services`);
          setService(response.data.services);
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

  const requestsNumber = service ? service.length : 0;
  const openRequest = service
    ? service.filter((item) => item.accomplished === false).length
    : 0;
  const completedRequest = service
    ? service.filter((item) => item.accomplished === true).length
    : 0;

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
            data={service}
            handleDeleteService={handleDeleteService}
            handleFilteredServices={handleFilteredServices}
            serviceFilterIsLoading={serviceFilterIsLoading}
          />
        </div>
      )}
    </>
  );
}

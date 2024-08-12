import { useContext, useEffect, useState } from 'react';

import Loading from '../../components/loading';
import { Statistics } from '../../components/statistics';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../lib/axios';
import { ServiceProps, ServicesTable } from './services-user-table';

export default function Dashboard() {
  const { loading, user } = useContext(AuthContext);
  const [serviceIsLoading, setServiceIsLoading] = useState(false);
  const [service, setService] = useState<ServiceProps[]>([]);

  async function handleDeleteService(id: string) {
    try {
      await api.delete(`/service/${id}`);
      setService(service.filter((s) => s.id !== id));
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

  const requestsNumber = service.length;
  const openRequest = service.filter(
    (item) => item.accomplished === false,
  ).length;
  const completedRequest = service.filter(
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
            data={service}
            handleDeleteService={handleDeleteService}
          />
        </div>
      )}
    </>
  );
}

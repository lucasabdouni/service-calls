import { useContext, useEffect, useState } from 'react';

import { Skeleton } from 'antd';
import { Header } from '../../components/header';
import Loading from '../../components/loading';
import { Menu } from '../../components/menu';
import { AuthContext } from '../../context/AuthContext';
import { api } from '../../lib/axios';
import { ServiceProps, ServicesByUser } from './services-by-user';
import { Statistics } from './statistics';

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
    <div className="w-full max-h-screen flex overflow-hidden">
      <Menu />
      <main className="w-full flex flex-col items-center justify-start">
        <Header />

        {serviceIsLoading ? (
          <Skeleton active />
        ) : (
          <div className="w-full h-screen max-w-6xl flex flex-col items-center justify-center gap-12 p-3">
            <Statistics
              openRequest={openRequest}
              requests={requestsNumber}
              completedRequest={completedRequest}
            />
            <ServicesByUser
              data={service}
              handleDeleteService={handleDeleteService}
            />
          </div>
        )}
      </main>
    </div>
  );
}

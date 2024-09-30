import { ServicesTable } from './services-user-table';
import { Statistics } from './statistics';

export default function Dashboard() {
  return (
    <div className="w-full h-full max-w-6xl flex flex-col items-center justify-center gap-12 p-3">
      <Statistics />
      <ServicesTable />
    </div>
  );
}

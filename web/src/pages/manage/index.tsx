import ManageDeparmentCard from './manage-department-card';
import ManageUserCard from './manage-user-card';

export default function Manage() {
  return (
    <div className="w-full h-full max-w-6xl flex flex-wrap items-center justify-center gap-12 p-3">
      <ManageUserCard />
      <ManageDeparmentCard />
    </div>
  );
}

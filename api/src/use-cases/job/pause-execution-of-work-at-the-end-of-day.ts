import {
  findJobsInRunning,
  pauseJobInExecution,
} from '@/repositories/job-repository';

export async function PauseExecutionOfWorkAtTheEndOfDayUseCase() {
  const runningJobs = await findJobsInRunning();

  if (!runningJobs || runningJobs.length === 0) {
    return;
  }

  const current_at = Date.now();

  await Promise.all(
    runningJobs.map(async (job) => {
      const status = 'Intervalo';
      const elapsedTime = job.elapsed_time + (current_at - job.start_time);

      await pauseJobInExecution({ id: job.id, elapsedTime, status });
    }),
  );
}

import { findJobsInInterval, startJob } from '@/repositories/job-repository';

export async function startExecutionOfWorkAtTheStartOfDayUseCase() {
  const pausedJobs = await findJobsInInterval();

  if (!pausedJobs || pausedJobs.length === 0) {
    return;
  }

  const current_at = Date.now();

  await Promise.all(
    pausedJobs.map(async (job) => {
      const startTime = current_at;

      await startJob({ id: job.id, startTime });
    }),
  );
}

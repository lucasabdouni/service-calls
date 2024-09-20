import { PauseExecutionOfWorkAtTheEndOfDayUseCase } from '@/use-cases/job/pause-execution-of-work-at-the-end-of-day';

export async function pauseJobServices() {
  await PauseExecutionOfWorkAtTheEndOfDayUseCase();
  console.log('Pause jobs');
}

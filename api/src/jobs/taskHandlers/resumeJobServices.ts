import { startExecutionOfWorkAtTheStartOfDayUseCase } from '@/use-cases/job/start-execution-of-work-at-the-start-of-day';

export async function resumeJobServices() {
  await startExecutionOfWorkAtTheStartOfDayUseCase();
  console.log('Start jobs');
}

import { Inject } from '@nestjs/common';
import { QUERY_RUNNER } from '../constants';

export const InjectQueryRunner = () => Inject(QUERY_RUNNER);

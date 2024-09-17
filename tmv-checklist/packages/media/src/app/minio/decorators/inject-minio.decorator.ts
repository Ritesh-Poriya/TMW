import { Inject } from '@nestjs/common';
import { MINIO_CLIENT } from '../constants';

export const InjectMinio = () => Inject(MINIO_CLIENT);

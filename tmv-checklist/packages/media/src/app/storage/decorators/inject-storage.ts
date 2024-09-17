import { Inject } from '@nestjs/common';
import { STORAGE } from '../constants';

export const InjectStorage = () => Inject(STORAGE);

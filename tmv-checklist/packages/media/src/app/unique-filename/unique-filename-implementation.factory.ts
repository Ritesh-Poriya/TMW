import { AddTimeStampPostName } from './implementations/add-time-stamp-post-name';

export class UniqueFilenameGeneratorFactory {
  static addTimeStampPostNameGenerator() {
    return new AddTimeStampPostName();
  }
}

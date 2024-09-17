import { UniqueFileNameGenerator } from '../@types';

export class AddTimeStampPostName implements UniqueFileNameGenerator {
  generate(fileName: string): string {
    return this.lowercase(this.addTimeStamp(this.replaceSpaces(fileName)));
  }

  private replaceSpaces(fileName: string): string {
    return fileName.replace(/ /g, '_');
  }

  private addTimeStamp(fileName: string): string {
    const date = new Date();
    const ext = fileName.split('.').pop();
    const name = fileName.split('.').slice(0, -1).join('-');
    return `${name}_${date.getTime()}.${ext}`;
  }

  private lowercase(fileName: string): string {
    return fileName.toLowerCase();
  }
}

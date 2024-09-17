export interface UniqueFileNameGenerator {
  generate: (fileName: string) => string;
}

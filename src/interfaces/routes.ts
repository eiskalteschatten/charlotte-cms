export interface FrontendScript {
  name: string;
  loadingMethod: 'defer' | 'async' | 'sync';
}

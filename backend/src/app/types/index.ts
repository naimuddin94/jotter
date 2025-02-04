export interface IErrorSource {
  path: string | number;
  message: string;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

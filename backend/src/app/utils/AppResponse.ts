import { IMeta } from '../types';

class AppResponse<T> {
  public success: boolean;
  constructor(
    public statusCode: number,
    public data: T,
    public message: string,
    public meta: IMeta | null = null
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    if (meta) {
      this.meta = meta;
    }
  }
}

export default AppResponse;

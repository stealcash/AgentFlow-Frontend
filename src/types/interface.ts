export interface ApiResponse {
  status?: number;
  message?: string;
  data?:unknown | {
    [key: string]: unknown;
  },
  header?: {
    user_type?: string;
    user_id?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface AuthApiResponse {
  status?: number;
  message?: string;
  header?: {
    user_type?: string;
    user_id?: string;
    [key: string]: unknown;
  };
  data?: {
    token?: string
    [key: string]: unknown;

  }
  [key: string]: unknown;
}



export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export type ErrorWithCode = {
  code: number;
  message: string;
  errors?: unknown;
};

export type ErrorWithCodeAny = {
  code: number;
  message?: unknown;
  errors?: unknown;
};
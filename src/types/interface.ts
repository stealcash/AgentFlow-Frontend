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

export interface ChatbotFile {
  id: number;
  title: string;
  file_type: string;
  created_at: string;
  file_data?: string; // base64 string, only present when getting a specific file
}

export interface UploadFileInput {
  title: string;
  file_data: string;
  file_type: string;
}
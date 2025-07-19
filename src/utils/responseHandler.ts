import { setHeader } from '../redux/slices/headerSlice';
import store from '../redux/store';
import { clearAuthToken } from './AuthToken';
import { ApiResponse } from '../types/interface';
import { BASE_PATH } from '../config/constants';

export function handleSuccess(response: ApiResponse) {
  if (response.header) {
    if (response.header.user_type) {
      store.dispatch(setHeader({
        user_type: String(response?.header?.user_type),
        user_id: String(response?.header?.user_id),
      }));
    }
  }
  return response;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleErrorWithCode(err: any) {
  if (!err) return { code: 500, message: 'Unknown error' };

  if ( err?.code ==="ERR_NETWORK"){
    // window.location.replace(BASE_PATH);
  }
  if (typeof err === 'string') return { code: 200, message: err };

  if (!err.response) return { code: 500, message: err.toString() };

  if (err.response.status === 401) {
    clearAuthToken();
    window.location.replace(BASE_PATH);
    return { code: 401, message: 'Unauthorized' };
  }

  return {
    code: err.response.status,
    message: err.response.data?.message || 'Error occurred',
  };
}

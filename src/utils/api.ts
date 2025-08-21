import axios from 'axios';
import { getAuthToken, updateAuthToken } from './AuthToken';
import { handleErrorWithCode, handleSuccess } from './responseHandler';
import { BASE_URL } from '../config/constants';
import { HttpMethod, ApiResponse, AuthApiResponse } from '../types/interface';


const getConfig = (extraHeaders = {}) => ({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAuthToken(true)}`,
    ...extraHeaders,
  },
});

const getPublicConfig = (extraHeaders = {}) => ({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...extraHeaders,
  },
});

/**
 * ✅ Core authenticated API call
 */
export async function callApi(
  type: HttpMethod,
  path: string,
  data: unknown = null,
  extraHeaders = {}
) {

  if (!path || !type) return;

  const url = `${BASE_URL}${path}`;
  try {
    let result;

    switch (type.toLowerCase()) {
      case 'get':
        result = await axios.get(url, getConfig(extraHeaders));
        break;
      case 'post':
        result = await axios.post(url, data, getConfig(extraHeaders));
        break;
      case 'put':
        result = await axios.put(url, data, getConfig(extraHeaders));
        break;
      case 'delete':
        result = await axios.delete(url, getConfig(extraHeaders));
        break;
      default:
        throw new Error('Unsupported HTTP method');
    }

    const responseData = result.data as ApiResponse;

    if (Number(responseData.status) !== 1) {
      throw new Error(responseData.message || 'Something went wrong');
    }

    return handleSuccess(responseData);
  } catch (err) {
    throw handleErrorWithCode(err);
  }
}

/**
 * ✅ Call API for login/signup → does NOT update header slice
 */
export async function callApiWithoutAuth(
  type: HttpMethod,
  path: string,
  data: unknown = null,
  extraHeaders = {}
) {
  if (!path || !type) return;

  const url = `${BASE_URL}${path}`;
  try {
    let result;

    switch (type.toLowerCase()) {
      case 'get':
        result = await axios.get(url, getPublicConfig(extraHeaders));
        break;
      case 'post':
        result = await axios.post(url, data, getPublicConfig(extraHeaders));
        break;
      case 'put':
        result = await axios.put(url, data, getPublicConfig(extraHeaders));
        break;
      case 'delete':
        result = await axios.delete(url, getPublicConfig(extraHeaders));
        break;
      default:
        throw new Error('Unsupported HTTP method');
    }

    const responseData = result.data as AuthApiResponse;

    if (responseData.data?.token) {
      updateAuthToken(responseData.data?.token as string);
    }

    if (Number(responseData.status) !== 1) {
      throw new Error(responseData.message || 'Something went wrong');
    }

    return handleSuccess(responseData);
  } catch (err) {
    throw handleErrorWithCode(err);
  }
}

export async function callPublicApi(
  type: HttpMethod,
  path: string,
  data: unknown = null,
  extraHeaders = {}
) {
  if (!path || !type) return;

  const url = `${BASE_URL}${path}`;
  try {
    let result;

    switch (type.toLowerCase()) {
      case 'get':
        result = await axios.get(url, getPublicConfig(extraHeaders));
        break;
      case 'post':
        result = await axios.post(url, data, getPublicConfig(extraHeaders));
        break;
      case 'put':
        result = await axios.put(url, data, getPublicConfig(extraHeaders));
        break;
      case 'delete':
        result = await axios.delete(url, getPublicConfig(extraHeaders));
        break;
      default:
        throw new Error('Unsupported HTTP method');
    }

    return result.data;
  } catch (err) {
    throw handleErrorWithCode(err);
  }
}



export async function callBinaryApi(
  type: HttpMethod,
  path: string,
  data: unknown = null,
  extraHeaders = {}
) {
  if (!path || !type) return;

  const url = `${BASE_URL}${path}`;
  try {
    let result;

    switch (type.toLowerCase()) {
      case 'get':
        result = await axios.get(url, {
          ...getConfig(extraHeaders),
          responseType: 'blob', // 👈 Important
        });
        break;
      case 'post':
        result = await axios.post(url, data, {
          ...getConfig(extraHeaders),
          responseType: 'blob',
        });
        break;
      default:
        throw new Error('Unsupported HTTP method for binary');
    }

    return result.data; // This will be a Blob
  } catch (err) {
    throw handleErrorWithCode(err);
  }
}
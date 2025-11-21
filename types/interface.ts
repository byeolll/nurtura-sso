export interface UserInfo {
    user_id?: string,
    first_name?: string,
    last_name?: string,
    middle_name?: string,
    suffix?: string,
    email?: string,
    address?: string 
}

export interface UseFetchOptions {
    method?: 'GET' | 'POST',
    headers?: Record<string, string>,
    body?: any,
    autoFetch?: boolean
}

export interface UseFetchResult<T> {
    data: T | null,
    error: Error | null,
    loading: boolean,
    refetch: (overrideOptions?: UseFetchOptions) => Promise<void>
}

// for createAccount
export interface EmailCheckResponse {
  exists: boolean;
}

export interface SendOTPRequest {
  email: string;
  code: number;
  time: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface SSOUserCheckResponse {
  isNewUser: boolean;
}

// for emailOTP
export interface VerifyOTPRequest {
  email: string;
  code: string;
  purpose: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
}
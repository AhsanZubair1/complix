export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
}

export interface UsersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export interface UserParams {
  limit?: number;
  offset?: number;
}

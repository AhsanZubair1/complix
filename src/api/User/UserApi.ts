import apiClient from "../index";
import { AxiosResponse } from "axios";
import { UsersResponse, UserParams } from "./UserType.type";

export const fetchUsers = async (
  params?: UserParams
): Promise<UsersResponse> => {
  try {
    const response: AxiosResponse<UsersResponse> = await apiClient.get(
      "/user_service/users",
      { params }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

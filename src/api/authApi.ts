const API_BASE_URL =
  `${import.meta.env.VITE_API_URL}/auth`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};

const handleJsonResponse = async (
  response: Response,
  fallbackMessage: string
) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
};

const sanitizeUserPayload = (payload: any) => {
  const body = { ...payload };

  if (body.branchId === "" || body.branchId == null) {
    delete body.branchId;
  }

  if (body.password === "" || body.password == null) {
    delete body.password;
  }

  return body;
};

export const loginCustomer =
  async (

    email: string,

    password: string
  ) => {

    const response =
      await fetch(

        `${API_BASE_URL}/login-customer`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            email,

            password
          })
        }
      );

    return handleJsonResponse(response, "Login failed");
  };

export const fetchUsers =
  async () => {
    const response =
      await fetch(

        `${API_BASE_URL}/users`,

        {
          method: "GET",
          headers: getAuthHeaders()
        }
      );

    return handleJsonResponse(response, "Failed to fetch users");
  };

export const createUser =
  async (
    userData: any
  ) => {
    const payload = sanitizeUserPayload(userData);
    console.log("createUser payload", payload);

    const response =
      await fetch(

        `${API_BASE_URL}/users`,

        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        }
      );

    return handleJsonResponse(response, "Failed to create user");
  };

export const updateUser =
  async (
    userId: string,
    updateData: any
  ) => {
    const response =
      await fetch(

        `${API_BASE_URL}/users/${userId}`,

        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(sanitizeUserPayload(updateData))
        }
      );

    return handleJsonResponse(response, "Failed to update user");
  };

export const deleteUser =
  async (
    userId: string
  ) => {
    const response =
      await fetch(

        `${API_BASE_URL}/users/${userId}`,

        {
          method: "DELETE",
          headers: getAuthHeaders()
        }
      );

    return handleJsonResponse(response, "Failed to delete user");
  };

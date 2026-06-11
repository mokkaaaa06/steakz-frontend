const API_URL =
  `${import.meta.env.VITE_API_URL}/menu`;

export const getMenuItems =
  async () => {

    const response =
      await fetch(API_URL);

    return response.json();
};

export const createMenuItem =
  async (
    item: any
  ) => {

    const response =
      await fetch(API_URL, {

        method:
          "POST",

        headers: {

          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(item)
      });

    return response.json();
};

export const updateMenuItem =
  async (
    id: string,
    item: any
  ) => {

    const response =
      await fetch(
        `${API_URL}/${id}`,
        {

          method:
            "PUT",

          headers: {

            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(item)
        }
      );

    return response.json();
};

export const deleteMenuItem =
  async (
    id: string
  ) => {

    const response =
      await fetch(
        `${API_URL}/${id}`,
        {
          method:
            "DELETE"
        }
      );

    return response.json();
};

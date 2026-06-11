const API_BASE_URL =
  `${import.meta.env.VITE_API_URL}/reservations`;

export const getMyReservations =
  async () => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(

        `${API_BASE_URL}/my`,

        {

          headers: {

            Authorization:
              `Bearer ${token}`
          }
        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to fetch reservations"
      );
    }

    return data;
  };

export const createReservation =
  async (

    reservationData: any
  ) => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(

        API_BASE_URL,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify(
            reservationData
          )
        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      throw new Error(
        data.message ||
        "Reservation creation failed"
      );
    }

    return data;
  };

export const cancelReservation =
  async (
    reservationId: string
  ) => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await fetch(

        `${API_BASE_URL}/cancel/${reservationId}`,

        {

          method: "PUT",

          headers: {

            Authorization:
              `Bearer ${token}`
          }
        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      throw new Error(
        data.message ||
        "Cancellation failed"
      );
    }

    return data;
  };

import {
  useEffect,
  useState
} from "react";

import {
  getUserBranchId
} from "../utils/branchHelpers";

const ReservationsPage = () => {

  const [reservations, setReservations] =
    useState<any[]>([]);

  const [branches, setBranches] =
    useState<any[]>([]);

  const [menuItems, setMenuItems] =
    useState<any[]>([]);

  const [selectedItems, setSelectedItems] =
    useState<any[]>([]);

  const [branchId, setBranchId] =
    useState("");

  const [guests, setGuests] =
    useState("");

  const [reservationTime,
    setReservationTime] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [message, setMessage] =
    useState("");

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  const formatCurrency = (value: any) =>
    `£${Number(value).toFixed(2)}`;

  useEffect(() => {

    fetchReservations();
    fetchBranches();
    fetchMenuItems();

  }, []);

  const fetchBranches =
    async () => {

      try {

        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/branches`,
            {

              headers: {

                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await response.json();

        setBranches(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.log(error);
      }
    };

  const fetchMenuItems =
    async () => {

      try {

        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/menu`
          );

        const data =
          await response.json();

        setMenuItems(data);

      } catch (error) {

        console.log(error);
      }
    };

  const fetchReservations =
    async () => {

      try {

        const branchId =
          getUserBranchId(user);

        let endpoint =
          `${import.meta.env.VITE_API_URL}/reservations/my`;

        if (
          user.role === "ADMIN" ||
          user.role === "HQ_MANAGER"
        ) {

          endpoint =
            `${import.meta.env.VITE_API_URL}/reservations/all`;
        }

        if (
          user.role ===
          "BRANCH_MANAGER"
        ) {
          if (!branchId) {
            console.warn(
              "BRANCH_MANAGER user missing branchId"
            );
            setReservations([]);
            return;
          }

          endpoint =
            `${import.meta.env.VITE_API_URL}/reservations/branch/${branchId}`;
        }

        const response =
          await fetch(endpoint, {

            headers: {

              Authorization:
                `Bearer ${token}`
            }
          });

        const data =
          await response.json();

        const reservationsData =
          Array.isArray(data)
            ? data
            : data.reservations || [];

        console.log(
          "Branch Manager reservations fetch",
          { branchId, endpoint, reservationsData }
        );

        setReservations(reservationsData);

      } catch (error) {

        console.log(error);
      }
    };

  const handleQuantityChange = (
    menuItemId: string,
    quantity: number
  ) => {

    if (quantity <= 0) {

      setSelectedItems(

        selectedItems.filter(

          (item) =>
            item.menuItemId !==
            menuItemId
        )
      );

      return;
    }

    const existing =
      selectedItems.find(

        (item) =>
          item.menuItemId ===
          menuItemId
      );

    if (existing) {

      setSelectedItems(

        selectedItems.map(

          (item) =>

            item.menuItemId ===
            menuItemId

              ? {
                  ...item,
                  quantity
                }

              : item
        )
      );

    } else {

      setSelectedItems([

        ...selectedItems,

        {
          menuItemId,
          quantity
        }
      ]);
    }
  };

  const calculateTotal =
    () => {

      let total = 0;

      selectedItems.forEach(
        (selectedItem) => {

          const menuItem =
            menuItems.find(

              (item) =>
                item.id ===
                selectedItem.menuItemId
            );

          if (menuItem) {

            total +=
              menuItem.price *
              selectedItem.quantity;
          }
        }
      );

      return total;
    };

  const createReservation = async (
    e: any
  ) => {

    e.preventDefault();

    try {

      const response =
        await fetch(
          `${import.meta.env.VITE_API_URL}/reservations`,
          {

            method:
              "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body:
              JSON.stringify({

                branchId,

                guests:
                  Number(guests),

                reservationTime,

                notes,

                items:
                  selectedItems
              })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message
        );
      }

      setMessage(
        "Your reservation and pre-order were created successfully."
      );

      setBranchId("");
      setGuests("");
      setReservationTime("");
      setNotes("");
      setSelectedItems([]);

      fetchReservations();

    } catch (error: any) {

      setMessage(error.message);
    }
  };

  const cancelReservation = async (
    reservationId: string
  ) => {

    try {

      const response =
        await fetch(

          `${import.meta.env.VITE_API_URL}/reservations/cancel/${reservationId}`,

          {

            method:
              "PUT",

            headers: {

              Authorization:
                `Bearer ${token}`
            }
          }
        );

      if (!response.ok) {

        const data =
          await response.json();

        throw new Error(
          data.message
        );
      }

      fetchReservations();

    } catch (error: any) {

      alert(error.message);
    }
  };

  const now = new Date();

  const upcomingReservations =
    reservations.filter((reservation) => {
      const reservationTime =
        new Date(reservation.reservationTime);

      return (
        !Number.isNaN(reservationTime.getTime()) &&
        reservationTime >= now &&
        reservation.status !== "COMPLETED" &&
        reservation.status !== "CANCELLED"
      );
    });

  const previousReservations =
    reservations.filter((reservation) => {
      const reservationTime =
        new Date(reservation.reservationTime);

      return (
        reservation.status === "COMPLETED" ||
        reservation.status === "CANCELLED" ||
        (
          !Number.isNaN(reservationTime.getTime()) &&
          reservationTime < now
        )
      );
    });

  return (

    <div
      style={{

        padding:
          "50px",

        background:
          "#14110f",

        minHeight:
          "100vh",

        color:
          "#f8f2dc"
      }}
    >

      <h1 style={titleStyle}>
        Reservations
      </h1>

      {user.role ===
        "CUSTOMER" && (

        <form
          onSubmit={createReservation}
        >

          <select
            value={branchId}
            onChange={(e) =>
              setBranchId(
                e.target.value
              )
            }
            style={inputStyle}
          >

            <option value="">
              Select Branch
            </option>

            {branches.map(
              (branch) => (

                <option
                  key={branch.id}
                  value={branch.id}
                >
                  {branch.name}
                  {" - "}
                  {branch.location}
                </option>
              )
            )}

          </select>

          <input
            type="number"
            placeholder="Guests"
            value={guests}
            onChange={(e) =>
              setGuests(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <input
            type="datetime-local"
            value={reservationTime}
            onChange={(e) =>
              setReservationTime(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <textarea
            placeholder="Special Notes"
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value
              )
            }
            style={textareaStyle}
          />

          <h2 style={sectionTitle}>
            Pre-Order Menu
          </h2>

          <div style={menuGrid}>

            {menuItems.map(
              (item) => {

                const selected =
                  selectedItems.find(

                    (selectedItem) =>
                      selectedItem.menuItemId ===
                      item.id
                  );

                return (

                  <div
                    key={item.id}
                    style={menuCard}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      style={menuImage}
                    />

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      {formatCurrency(item.price)}
                    </p>

                    <input
                      type="number"
                      min="0"
                      value={
                        selected?.quantity || 0
                      }
                      onChange={(e) =>
                        handleQuantityChange(
                          item.id,
                          Number(
                            e.target.value
                          )
                        )
                      }
                      style={quantityInput}
                    />

                  </div>
                );
              }
            )}

          </div>

          <h2
            style={{
              marginTop:
                "40px",

              color:
                "#CCA25A"
            }}
          >

            Total:
            {" "}
            {formatCurrency(calculateTotal())}

          </h2>

          <button style={buttonStyle}>
            Reserve & Pre-Order
          </button>

        </form>
      )}

      {message && (

        <p style={messageStyle}>
          {message}
        </p>
      )}

      <h2 style={sectionTitle}>
        Upcoming Reservations
      </h2>

      <div style={gridStyle}>

        {upcomingReservations.length === 0 && (
          <div
            style={{
              color: "#d6c6a5",
              fontSize: "20px"
            }}
          >
            No upcoming reservations found.
          </div>
        )}

        {upcomingReservations.map(
          (reservation) => (

            <div
              key={reservation.id}
              style={cardStyle}
            >

              <h2>
                Guests:
                {" "}
                {reservation.guests}
              </h2>

              <p>
                Status:
                {" "}
                {reservation.status}
              </p>

              <p>
                Branch:
                {" "}
                {
                  reservation.branch?.name
                }
              </p>

              <p>
                Location:
                {" "}
                {
                  reservation.branch?.location
                }
              </p>

              <p>
                Reservation Time:
                {" "}
                {
                  new Date(
                    reservation.reservationTime
                  ).toLocaleString()
                }
              </p>

              {reservation.notes && (

                <p>
                  Notes:
                  {" "}
                  {reservation.notes}
                </p>
              )}

              {user.role ===
                "CUSTOMER" && (

                <button
                  style={cancelButton}
                  onClick={() =>
                    cancelReservation(
                      reservation.id
                    )
                  }
                >
                  Cancel
                </button>
              )}

            </div>
          )
        )}

      </div>

      <h2 style={sectionTitle}>
        Previous Reservations
      </h2>

      <div style={gridStyle}>

        {previousReservations.length === 0 && (
          <div
            style={{
              color: "#d6c6a5",
              fontSize: "20px"
            }}
          >
            No previous reservations found.
          </div>
        )}

        {previousReservations.map(
          (reservation) => (
            <div
              key={reservation.id}
              style={cardStyle}
            >
              <h2>
                Guests:
                {" "}
                {reservation.guests}
              </h2>

              <p>
                Status:
                {" "}
                {reservation.status}
              </p>

              <p>
                Branch:
                {" "}
                {
                  reservation.branch?.name
                }
              </p>

              <p>
                Location:
                {" "}
                {
                  reservation.branch?.location
                }
              </p>

              <p>
                Reservation Time:
                {" "}
                {
                  new Date(
                    reservation.reservationTime
                  ).toLocaleString()
                }
              </p>

              {reservation.notes && (
                <p>
                  Notes:
                  {" "}
                  {reservation.notes}
                </p>
              )}
            </div>
          )
        )}
      </div>

    </div>
  );
};

const titleStyle = {

  fontSize:
    "64px",

  marginBottom:
    "40px",

  color:
    "#CCA25A",

  fontWeight:
    400
};

const sectionTitle = {

  color:
    "#CCA25A",

  marginTop:
    "60px",

  marginBottom:
    "30px",

  fontSize:
    "42px"
};

const inputStyle = {

  display:
    "block",

  width:
    "100%",

  maxWidth:
    "500px",

  marginBottom:
    "20px",

  padding:
    "18px",

  background:
    "#1f1a16",

  color:
    "#f8f2dc",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius:
    "14px",

  fontSize:
    "18px"
};

const textareaStyle = {

  ...inputStyle,

  height:
    "140px"
};

const menuGrid = {

  display:
    "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",

  gap:
    "25px"
};

const menuCard = {

  background:
    "#1f1a16",

  padding:
    "20px",

  borderRadius:
    "18px",

  border:
    "1px solid rgba(255,255,255,0.08)"
};

const menuImage = {

  width:
    "100%",

  height:
    "220px",

  objectFit:
    "cover" as const,

  borderRadius:
    "14px",

  marginBottom:
    "15px"
};

const quantityInput = {

  width:
    "100%",

  padding:
    "12px",

  marginTop:
    "15px",

  background:
    "#14110f",

  color:
    "#f8f2dc",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius:
    "10px"
};

const buttonStyle = {

  background:
    "#CCA25A",

  color:
    "#14110f",

  border:
    "none",

  padding:
    "18px 28px",

  borderRadius:
    "14px",

  cursor:
    "pointer",

  fontWeight:
    "bold",

  fontSize:
    "20px",

  marginTop:
    "40px"
};

const messageStyle = {

  color:
    "#CCA25A",

  marginBottom:
    "30px",

  fontSize:
    "18px"
};

const gridStyle = {

  display:
    "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(320px, 1fr))",

  gap:
    "30px"
};

const cardStyle = {

  background:
    "#1f1a16",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius:
    "20px",

  padding:
    "28px"
};

const cancelButton = {

  background:
    "#8B0000",

  color:
    "white",

  border:
    "none",

  padding:
    "10px 18px",

  borderRadius:
    "10px",

  cursor:
    "pointer",

  marginTop:
    "20px"
};

export default ReservationsPage;

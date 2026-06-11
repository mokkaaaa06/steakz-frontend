import {
  useEffect,
  useState
} from "react";

import {
  getBranchId,
  getReservationBranchId
} from "../utils/branchHelpers";

const API_BASE_URL =
  import.meta.env.VITE_API_URL;

const formatCurrency = (value: any) =>
  `£${Number(value).toFixed(2)}`;

const ChefOrdersPage = () => {

  const [orders, setOrders] =
    useState<any[]>([]);

  const user =
    JSON.parse(
      localStorage.getItem("user") || "null"
    );

  const token =
    localStorage.getItem("token");

  const fetchOrders = async () => {

    try {

      const response =
        await fetch(

          `${API_BASE_URL}/orders/chef`,

          {

            headers: {

              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const data =
        await response.json();

      const branchId = getBranchId(user);

      const filteredOrders =
        Array.isArray(data)
          ? data.filter((order: any) =>
              getReservationBranchId(
                order.reservation
              ) === branchId
            )
          : [];

      setOrders(filteredOrders);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchOrders();

  }, []);

  const updateStatus = async (

    orderId: string,

    status: string

  ) => {

    try {

      const response =
        await fetch(

          `${API_BASE_URL}/orders/${orderId}/status`,

          {

            method:
              "PATCH",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body:
              JSON.stringify({
                status
              })
          }
        );

      if (!response.ok) {

        throw new Error(
          "Failed to update order"
        );
      }

      fetchOrders();

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div
      style={{

        minHeight:
          "100vh",

        background:
          "#14110f",

        color:
          "#f8f2dc",

        padding:
          "50px"
      }}
    >

      <h1
        style={{

          fontSize:
            "64px",

          marginBottom:
            "40px"
        }}
      >
        Kitchen Orders
      </h1>

      <div
        style={{

          display:
            "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",

          gap:
            "24px"
        }}
      >

        {orders.length === 0 ? (
          <div
            style={{
              color: "#d6c6a5",
              fontSize: "22px",
              gridColumn: "1 / -1"
            }}
          >
            No kitchen orders for your branch.
          </div>
        ) : (
          orders.map((order) => (

          <div

            key={order.id}

            style={{

              background:
                "#1f1a17",

              border:
                "1px solid #3a2d22",

              borderRadius:
                "20px",

              padding:
                "24px"
            }}
          >

            <h2>
              {order.reservation.branch.name}
            </h2>

            <p>
              Customer:
              {" "}
              {order.customer.name}
            </p>

            <p>
              Status:
              {" "}
              {order.status}
            </p>

            <p>
              Total:
              {" "}
              {formatCurrency(order.totalPrice)}
            </p>

            <hr
              style={{
                margin:
                  "16px 0"
              }}
            />

            <h3>
              Ordered Items
            </h3>

            {order.orderItems.map(
              (item: any) => (

                <div
                  key={item.id}
                  style={{
                    marginBottom:
                      "12px"
                  }}
                >

                  <strong>
                    {item.menuItem.name}
                  </strong>

                  <p>
                    Quantity:
                    {" "}
                    {item.quantity}
                  </p>

                  <p>
                    Subtotal:
                    {" "}
                    {formatCurrency(item.subtotal)}
                  </p>

                </div>
              )
            )}

            <div
              style={{

                display:
                  "flex",

                gap:
                  "12px",

                marginTop:
                  "20px"
              }}
            >

              {order.status ===
                "PENDING" && (

                <button

                  onClick={() =>
                    updateStatus(
                      order.id,
                      "CONFIRMED"
                    )
                  }

                  style={{

                    background:
                      "#d4a85f",

                    border:
                      "none",

                    padding:
                      "10px 16px",

                    borderRadius:
                      "10px",

                    cursor:
                      "pointer"
                  }}
                >
                  Confirm Order
                </button>
              )}

              {order.status ===
                "CONFIRMED" && (

                <button

                  onClick={() =>
                    updateStatus(
                      order.id,
                      "PREPARING"
                    )
                  }

                  style={{

                    background:
                      "#d4a85f",

                    border:
                      "none",

                    padding:
                      "10px 16px",

                    borderRadius:
                      "10px",

                    cursor:
                      "pointer"
                  }}
                >
                  Start Preparing
                </button>
              )}

              {order.status ===
                "PREPARING" && (

                <button

                  onClick={() =>
                    updateStatus(
                      order.id,
                      "READY"
                    )
                  }

                  style={{

                    background:
                      "#4caf50",

                    border:
                      "none",

                    padding:
                      "10px 16px",

                    borderRadius:
                      "10px",

                    color:
                      "white",

                    cursor:
                      "pointer"
                  }}
                >
                  Mark Ready
                </button>
              )}

              {order.status ===
                "READY" && (

                <button

                  onClick={() =>
                    updateStatus(
                      order.id,
                      "COMPLETED"
                    )
                  }

                  style={{

                    background:
                      "#2196f3",

                    border:
                      "none",

                    padding:
                      "10px 16px",

                    borderRadius:
                      "10px",

                    color:
                      "white",

                    cursor:
                      "pointer"
                  }}
                >
                  Complete Order
                </button>
              )}

            </div>

          </div>
        ))) }
      </div>
    </div>
  );
};

export default ChefOrdersPage;

import {
  useEffect,
  useState
} from "react";

import {
  getBranchId
} from "../utils/branchHelpers";

export default function ShiftManagementPage() {

  const user =
    JSON.parse(
      localStorage.getItem("user") || "null"
    );

  const canAssignShifts =
    user?.role === "ADMIN" ||
    user?.role === "BRANCH_MANAGER";

  const [chefs, setChefs] =
    useState<any[]>([]);

  const [shifts, setShifts] =
    useState<any[]>([]);

  const [form, setForm] =
    useState({

      chefId: "",
      startTime: "",
      endTime: ""
    });

  useEffect(() => {

    fetchChefs();
    fetchShifts();

  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };
  };

  const fetchChefs =
    async () => {

      const response =
        await fetch(
          `${import.meta.env.VITE_API_URL}/shifts/chefs`,
          {
            headers: getAuthHeaders()
          }
        );

      const data =
        await response.json();

      const chefList = Array.isArray(data)
        ? data
        : [];

      const userBranchId = getBranchId(user);

      setChefs(
        user?.role === "BRANCH_MANAGER"
          ? chefList.filter((chef: any) =>
              getBranchId(chef) === userBranchId
            )
          : chefList
      );
    };

  const fetchShifts =
    async () => {

      const response =
        await fetch(
          `${import.meta.env.VITE_API_URL}/shifts/all`,
          {
            headers: getAuthHeaders()
          }
        );

      const data =
        await response.json();

      const shiftList = Array.isArray(data)
        ? data
        : [];

      const userBranchId = getBranchId(user);

      setShifts(
        user?.role === "BRANCH_MANAGER"
          ? shiftList.filter((shift: any) =>
              getBranchId(shift) === userBranchId ||
              getBranchId(shift.chef) === userBranchId
            )
          : shiftList
      );
    };

  const createShift =
    async (
      e: any
    ) => {

      e.preventDefault();

      await fetch(
        `${import.meta.env.VITE_API_URL}/shifts`,
        {

          method:
            "POST",

          headers: getAuthHeaders(),

          body:
            JSON.stringify(form)
        }
      );

      setForm({

        chefId: "",
        startTime: "",
        endTime: ""
      });

      fetchShifts();
    };

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

      <h1
        style={{

          fontSize:
            "64px",

          color:
            "#CCA25A",

          marginBottom:
            "50px",

          fontWeight:
            400
        }}
      >
        Shift Management
      </h1>

      {canAssignShifts ? (
        <form
          onSubmit={createShift}

          style={formStyle}
        >

          <select
            value={form.chefId}

            onChange={(e) =>
              setForm({

                ...form,

                chefId:
                  e.target.value
              })
            }

            style={inputStyle}
          >

            <option value="">
              Select Chef
            </option>

            {

              chefs.map((chef) => (

                <option
                  key={chef.id}
                  value={chef.id}
                >
                  {chef.name} ({chef.email})
                </option>

              ))
            }

          </select>

          <input
            type="datetime-local"

            value={form.startTime}

            onChange={(e) =>
              setForm({

                ...form,

                startTime:
                  e.target.value
              })
            }

            style={inputStyle}
          />

          <input
            type="datetime-local"

            value={form.endTime}

            onChange={(e) =>
              setForm({

                ...form,

                endTime:
                  e.target.value
              })
            }

            style={inputStyle}
          />

          <button
            type="submit"

            style={buttonStyle}
          >
            Assign Shift
          </button>

        </form>
      ) : (
        <p style={noticeStyle}>
          Only ADMIN and BRANCH_MANAGER users can assign shifts.
        </p>
      )}

      <div
        style={gridStyle}
      >

        {

          shifts.map((shift) => (

            <div
              key={shift.id}

              style={cardStyle}
            >

              <h2>
                {
                  shift.chef?.name
                }
              </h2>

              <p>
                Start:
              </p>

              <p>
                {
                  new Date(
                    shift.startTime
                  ).toLocaleString()
                }
              </p>

              <p
                style={{
                  marginTop: "20px"
                }}
              >
                End:
              </p>

              <p>
                {
                  new Date(
                    shift.endTime
                  ).toLocaleString()
                }
              </p>

            </div>

          ))
        }

      </div>

    </div>
  );
}

const formStyle = {

  display:
    "flex",

  flexDirection:
    "column" as const,

  gap:
    "20px",

  maxWidth:
    "600px",

  marginBottom:
    "60px"
};

const inputStyle = {

  padding:
    "18px",

  background:
    "#1f1a16",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius:
    "12px",

  color:
    "#f8f2dc",

  fontSize:
    "18px"
};

const noticeStyle = {
  color: "#d6c6a5",
  fontSize: "20px",
  background: "rgba(255,255,255,0.04)",
  padding: "18px",
  borderRadius: "14px",
  maxWidth: "600px"
};

const buttonStyle = {

  background:
    "#CCA25A",

  color:
    "#14110f",

  border:
    "none",

  padding:
    "18px",

  borderRadius:
    "12px",

  cursor:
    "pointer",

  fontWeight:
    "bold",

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

  padding:
    "30px",

  borderRadius:
    "20px",

  border:
    "1px solid rgba(255,255,255,0.08)"
};
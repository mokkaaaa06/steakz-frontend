import {
  FaUtensils,
  FaSignOutAlt,
  FaUser
} from "react-icons/fa";

import {
  NavLink
} from "react-router-dom";

export default function Navbar() {

  const user =
    JSON.parse(
      localStorage.getItem("user") || "null"
    );

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "/";
  };

  const getNavStyle = () => ({

    color:
      "#f8f2dc",

    textDecoration:
      "none",

    fontSize:
      "20px",

    fontWeight:
      500,

    fontFamily:
      "'Cormorant Garamond', serif",

    display:
      "flex",

    alignItems:
      "center",

    justifyContent:
      "center",

    transition:
      "0.3s ease",

    whiteSpace:
      "nowrap",

    lineHeight:
      "1"
  });

  return (

    <div
      style={{

        width:
          "100%",

        background:
          "linear-gradient(to right, #15120f, #211c17)",

        borderBottom:
          "1px solid rgba(255,255,255,0.08)",

        position:
          "sticky",

        top:
          0,

        zIndex:
          1000,

        backdropFilter:
          "blur(10px)",

        boxShadow:
          "0 4px 30px rgba(0,0,0,0.45)"
      }}
    >

      <div
        style={{

          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          padding:
            "22px 38px"
        }}
      >

        <div
          style={{

            display:
              "flex",

            alignItems:
              "center",

            gap:
              "14px"
          }}
        >

          <FaUtensils
            style={{

              color:
                "#CCA25A",

              fontSize:
                "30px"
            }}
          />

          <h1
            style={{

              color:
                "#CCA25A",

              fontSize:
                "42px",

              fontWeight:
                600,

              letterSpacing:
                "3px",

              margin:
                0
            }}
          >
            Steakz
          </h1>

        </div>

        <div
          style={{

            display:
              "flex",

            alignItems:
              "center",

            gap:
              "18px"
          }}
        >

          {user && (

            <div
              style={{

                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "10px",

                color:
                  "#f8f2dc",

                fontSize:
                  "20px"
              }}
            >

              <FaUser
                style={{
                  color: "#CCA25A"
                }}
              />

              {user.name}

            </div>

          )}

          {user && (

            <button
              onClick={logout}

              style={{

                background:
                  "#CCA25A",

                border:
                  "none",

                color:
                  "#1a1714",

                padding:
                  "12px 18px",

                borderRadius:
                  "14px",

                cursor:
                  "pointer",

                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "10px",

                fontWeight:
                  "bold",

                fontSize:
                  "16px",

                transition:
                  "0.3s",

                boxShadow:
                  "0 0 15px rgba(204,162,90,0.3)"
              }}
            >

              <FaSignOutAlt />

              Logout

            </button>

          )}

        </div>

      </div>

      <div
        style={{

          borderTop:
            "1px solid rgba(255,255,255,0.05)",

          padding:
            "24px 0"
        }}
      >

        <div
          style={{

            display:
              "flex",

            justifyContent:
              "center",

            alignItems:
              "center",

            gap:
              "70px",

            flexWrap:
              "wrap"
          }}
        >

          <NavLink
            to="/"
            style={getNavStyle}
          >
            Home
          </NavLink>

          <NavLink
            to="/menu"
            style={getNavStyle}
          >
            Menu
          </NavLink>

          {user?.role ===
            "CUSTOMER" && (

            <NavLink
              to="/reservations"
              style={getNavStyle}
            >
              Reservations
            </NavLink>
          )}

          {(user?.role ===
            "BRANCH_MANAGER" ||

            user?.role ===
            "ADMIN" ||

            user?.role ===
            "HQ_MANAGER") && (

            <>
              <NavLink
                to="/reservations"
                style={getNavStyle}
              >
                Reservations
              </NavLink>

              <NavLink
                to="/analytics"
                style={getNavStyle}
              >
                Analytics
              </NavLink>
            </>
          )}

          {user?.role ===
            "CHEF" && (

            <>
              <NavLink
                to="/chef-dashboard"
                style={getNavStyle}
              >
                Chef Dashboard
              </NavLink>

              <NavLink
                to="/kitchen"
                style={getNavStyle}
              >
                Kitchen
              </NavLink>
            </>
          )}

          {(user?.role ===
            "BRANCH_MANAGER" ||

            user?.role ===
            "CHEF") && (

            <NavLink
              to="/shifts"
              style={getNavStyle}
            >
              Shifts
            </NavLink>
          )}

          {user?.role ===
            "ADMIN" && (

            <NavLink
              to="/admin/menu"
              style={getNavStyle}
            >
              Admin Menu
            </NavLink>
          )}

        </div>

      </div>

    </div>
  );
}
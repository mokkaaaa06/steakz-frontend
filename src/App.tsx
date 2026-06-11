import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  FaVolumeUp,
  FaVolumeMute,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";

import LoginPage
from "./pages/LoginPage";

import RegisterPage
from "./pages/RegisterPage";

import DashboardPage
from "./pages/DashboardPage";

import ReservationsPage
from "./pages/ReservationsPage";

import AnalyticsPage
from "./pages/AnalyticsPage";

import NotFoundPage
from "./pages/NotFoundPage";

import BranchesPage
from "./pages/BranchesPage";

import BranchManagementPage
from "./pages/BranchManagementPage";

import MenuPage
from "./pages/MenuPage";

import AdminMenuPage
from "./pages/AdminMenuPage";

import UserManagementPage
from "./pages/UserManagementPage";

import ChefDashboardPage
from "./pages/ChefDashboardPage";

import ShiftManagementPage
from "./pages/ShiftManagementPage";

import ChefOrdersPage
from "./pages/ChefOrdersPage";

import ProtectedRoute
from "./components/ProtectedRoute.tsx";


function App() {

  const user =
    JSON.parse(
      localStorage.getItem("user") || "null"
    );

  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const [muted, setMuted] =
    useState(false);

  useEffect(() => {

    const playAudio = async () => {

      try {

        if (audioRef.current) {

          audioRef.current.volume =
            0.2;

          audioRef.current.muted =
            false;

          await audioRef.current.play();
        }

      } catch (error) {

        console.log(error);
      }
    };

    setTimeout(() => {

      playAudio();

    }, 1000);

  }, []);

  const toggleMute = () => {

    if (!audioRef.current)
      return;

    audioRef.current.muted =
      !audioRef.current.muted;

    setMuted(
      audioRef.current.muted
    );
  };

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href =
      "/";
  };

  return (

    <BrowserRouter>

      <audio
        ref={audioRef}
        loop
        autoPlay
      >

        <source
          src="/evening-birds.mp3"
          type="audio/mpeg"
        />

      </audio>

      <div
        style={{

          background:
            "#14110f",

          color:
            "#f8f2dc",

          minHeight:
            "100vh",

          fontFamily:
            "'Cormorant Garamond', serif"
        }}
      >

        <header
          style={{

            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            padding:
              "24px 40px",

            borderBottom:
              "1px solid rgba(255,255,255,0.08)",

            background:
              "linear-gradient(to right, #14110f, #1e1813)"
          }}
        >

          <Link
            to="/"

            style={{
              textDecoration:
                "none"
            }}
          >

            <h1
              style={{

                color:
                  "#CCA25A",

                fontSize:
                  "54px",

                fontWeight:
                  400,

                letterSpacing:
                  "3px",

                margin:
                  0
              }}
            >
              Steakz
            </h1>

          </Link>

          <div
            style={{

              display:
                "flex",

              alignItems:
                "center",

              gap:
                "20px"
            }}
          >

            {user ? (

              <>

                <div
                  style={{

                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      "10px",

                    fontSize:
                      "24px"
                  }}
                >

                  <FaUser
                    color="#CCA25A"
                  />

                  <span>
                    {user.name}
                  </span>

                </div>

                <button
                  onClick={logout}

                  style={logoutButton}
                >

                  <FaSignOutAlt />

                  Logout

                </button>

              </>

            ) : (

              <div
                style={{

                  display:
                    "flex",

                  gap:
                    "16px"
                }}
              >

                <Link
                  to="/login"

                  style={authButton}
                >
                  Login
                </Link>

                <Link
                  to="/register"

                  style={registerButton}
                >
                  Register
                </Link>

              </div>

            )}

          </div>

        </header>

        <button
          onClick={toggleMute}

          style={musicButton}
        >

          {
            muted
              ? <FaVolumeMute />
              : <FaVolumeUp />
          }

        </button>

        <nav
          style={{

            display:
              "flex",

            justifyContent:
              "center",

            gap:
              "50px",

            padding:
              "28px",

            background:
              "#181411",

            borderBottom:
              "1px solid rgba(255,255,255,0.05)",

            flexWrap:
              "wrap"
          }}
        >

          {(!user || user?.role === "CUSTOMER" || user?.role === "ADMIN") && (
            <>
              <Link
                to="/"
                style={navLink}
              >
                Home
              </Link>

              <Link
                to="/menu"
                style={navLink}
              >
                Menu
              </Link>
            </>
          )}

          {
            (
              user?.role === "CUSTOMER" ||
              user?.role === "ADMIN" ||
              user?.role === "HQ_MANAGER" ||
              user?.role === "BRANCH_MANAGER"
            ) && (

              <Link
                to="/reservations"
                style={navLink}
              >
                Reservations
              </Link>
            )
          }

          {
            (
              user?.role === "ADMIN" ||
              user?.role === "HQ_MANAGER" ||
              user?.role === "BRANCH_MANAGER"
            ) && (

              <Link
                to="/analytics"
                style={navLink}
              >
                Analytics
              </Link>
            )
          }

          {
            (
              user?.role === "ADMIN" ||
              user?.role === "HQ_MANAGER"
            ) && (

              <Link
                to="/branches"
                style={navLink}
              >
                Branches
              </Link>
            )
          }

          {
            (
              user?.role === "ADMIN" ||
              user?.role === "HQ_MANAGER"
            ) && (

              <Link
                to="/branch-management"
                style={navLink}
              >
                Branch Management
              </Link>
            )
          }

          {
            user?.role === "ADMIN" && (

              <Link
                to="/admin-menu"
                style={navLink}
              >
                Menu CMS
              </Link>
            )
          }

          {
            user?.role === "ADMIN" && (

              <Link
                to="/admin-users"
                style={navLink}
              >
                Users
              </Link>
            )
          }

          {
            (
              user?.role === "ADMIN" ||
              user?.role === "BRANCH_MANAGER"
            ) && (

              <Link
                to="/shift-management"
                style={navLink}
              >
                Shifts
              </Link>
            )
          }

          {
            user?.role === "CHEF" && (

              <><Link
                to="/chef-dashboard"
                style={navLink}
              >
                Chef Dashboard
              </Link><Link to="/kitchen">
                  Kitchen
                </Link></>
            )
          }

        </nav>

        <Routes>

          <Route
            path="/"
            element={
              !user
                ? <DashboardPage />
                : user?.role === "CUSTOMER"
                  ? <DashboardPage />
                  : user?.role === "ADMIN"
                    ? <DashboardPage />
                    : user?.role === "HQ_MANAGER"
                      ? <Navigate to="/analytics" replace />
                      : user?.role === "BRANCH_MANAGER"
                        ? <Navigate to="/reservations" replace />
                        : user?.role === "CHEF"
                          ? <Navigate to="/chef-dashboard" replace />
                          : <NotFoundPage />
            }
          />

          {(!user || user?.role === "CUSTOMER" || user?.role === "ADMIN") && (
            <Route
              path="/menu"
              element={<MenuPage />}
            />
          )}

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          {(!user || user?.role === "CUSTOMER" || user?.role === "ADMIN" || user?.role === "HQ_MANAGER" || user?.role === "BRANCH_MANAGER") && (
            <Route
              path="/reservations"
              element={
                !user
                  ? <GuestReservationMessage />
                  : <ReservationsPage />
              }
            />
          )}

          {user?.role === "CHEF" && (
            <Route
              path="/kitchen"
              element={
                <ProtectedRoute
                  allowedRoles={["CHEF"]}
                >
                  <ChefOrdersPage />
                </ProtectedRoute>
              }
            />
          )}

          {(user?.role === "ADMIN" || user?.role === "HQ_MANAGER" || user?.role === "BRANCH_MANAGER") && (
            <Route
              path="/analytics"
              element={<AnalyticsPage />}
            />
          )}

          {(user?.role === "ADMIN" || user?.role === "HQ_MANAGER") && (
            <Route
              path="/branches"
              element={<BranchesPage />}
            />
          )}

          {(user?.role === "ADMIN" || user?.role === "HQ_MANAGER") && (
            <Route
              path="/branch-management"
              element={<BranchManagementPage />}
            />
          )}

          {user?.role === "ADMIN" && (
            <Route
              path="/admin-menu"
              element={<AdminMenuPage />}
            />
          )}

          {user?.role === "ADMIN" && (
            <Route
              path="/admin-users"
              element={<UserManagementPage />}
            />
          )}

          {(user?.role === "ADMIN" || user?.role === "BRANCH_MANAGER") && (
            <Route
              path="/shift-management"
              element={<ShiftManagementPage />}
            />
          )}

          {(user?.role === "CHEF" || user?.role === "ADMIN") && (
            <Route
              path="/chef-dashboard"
              element={<ChefDashboardPage />}
            />
          )}

          <Route
            path="*"
            element={<NotFoundPage />}
          />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

function GuestReservationMessage() {

  return (

    <div
      style={{

        display:
          "flex",

        flexDirection:
          "column",

        justifyContent:
          "center",

        alignItems:
          "center",

        textAlign:
          "center",

        minHeight:
          "70vh",

        padding:
          "40px"
      }}
    >

      <h1
        style={{

          color:
            "#CCA25A",

          fontSize:
            "72px",

          marginBottom:
            "24px",

          fontWeight:
            400
        }}
      >
        Reserve Your Luxury Experience
      </h1>

      <p
        style={{

          color:
            "#d6c6a5",

          fontSize:
            "28px",

          maxWidth:
            "700px",

          lineHeight:
            "1.7",

          marginBottom:
            "40px"
        }}
      >
        Please create an account or
        login first to reserve your
        table and enjoy the full
        Steakz experience.
      </p>

      <div
        style={{

          display:
            "flex",

          gap:
            "20px",

          flexWrap:
            "wrap"
        }}
      >

        <Link
          to="/login"

          style={guestButton}
        >
          Login
        </Link>

        <Link
          to="/register"

          style={guestRegisterButton}
        >
          Create Account
        </Link>

      </div>

    </div>
  );
}

const navLink = {

  color:
    "#f8f2dc",

  textDecoration:
    "none",

  fontSize:
    "28px",

  letterSpacing:
    "1px",

  transition:
    "0.3s ease"
};

const musicButton = {

  position:
    "fixed" as const,

  top:
    "120px",

  right:
    "25px",

  width:
    "62px",

  height:
    "62px",

  borderRadius:
    "50%",

  border:
    "1px solid rgba(255,255,255,0.08)",

  background:
    "#1e1813",

  color:
    "#CCA25A",

  fontSize:
    "22px",

  cursor:
    "pointer",

  zIndex:
    999,

  boxShadow:
    "0 0 20px rgba(0,0,0,0.4)"
};

const logoutButton = {

  background:
    "#CCA25A",

  color:
    "#14110f",

  border:
    "none",

  padding:
    "12px 18px",

  borderRadius:
    "12px",

  display:
    "flex",

  alignItems:
    "center",

  gap:
    "10px",

  cursor:
    "pointer",

  fontWeight:
    "bold",

  fontSize:
    "16px"
};

const authButton = {

  background:
    "transparent",

  color:
    "#f8f2dc",

  border:
    "1px solid rgba(255,255,255,0.15)",

  padding:
    "12px 22px",

  borderRadius:
    "12px",

  textDecoration:
    "none",

  fontSize:
    "18px"
};

const registerButton = {

  background:
    "#CCA25A",

  color:
    "#14110f",

  padding:
    "12px 22px",

  borderRadius:
    "12px",

  textDecoration:
    "none",

  fontWeight:
    "bold",

  fontSize:
    "18px"
};

const guestButton = {

  background:
    "transparent",

  color:
    "#f8f2dc",

  border:
    "1px solid rgba(255,255,255,0.15)",

  padding:
    "16px 32px",

  borderRadius:
    "14px",

  textDecoration:
    "none",

  fontSize:
    "20px"
};

const guestRegisterButton = {

  background:
    "#CCA25A",

  color:
    "#14110f",

  padding:
    "16px 32px",

  borderRadius:
    "14px",

  textDecoration:
    "none",

  fontWeight:
    "bold",

  fontSize:
    "20px"
};

export default App;
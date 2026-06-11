import {
  useEffect,
  useState
} from "react";

import {
  getUserBranchId
} from "../utils/branchHelpers";

const AnalyticsPage = () => {

  const [analytics, setAnalytics] =
    useState<any>(null);

  const [branches, setBranches] =
    useState<any[]>([]);

  const [selectedBranch,
    setSelectedBranch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const formatCurrency = (value: any) =>
    `£${Number(value).toFixed(2)}`;

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  useEffect(() => {

    fetchBranches();

  }, []);

  useEffect(() => {

    fetchAnalytics();

  }, [selectedBranch]);

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

        setBranches(data);

      } catch (error) {

        console.log(error);
      }
    };

  const fetchAnalytics = async () => {

    try {

      setLoading(true);

      let endpoint =
        `${import.meta.env.VITE_API_URL}/analytics`;

      /*
      |--------------------------------------------------------------------------
      | BRANCH MANAGER
      |--------------------------------------------------------------------------
      */

      if (
        user.role ===
        "BRANCH_MANAGER"
      ) {
        const branchId = getUserBranchId(user);

        endpoint =
          `${import.meta.env.VITE_API_URL}/analytics/branch/${branchId}`;
      }

      /*
      |--------------------------------------------------------------------------
      | ADMIN / HQ FILTER
      |--------------------------------------------------------------------------
      */

      if (
        (
          user.role === "ADMIN" ||
          user.role === "HQ_MANAGER"
        ) &&
        selectedBranch
      ) {

        endpoint =
          `${import.meta.env.VITE_API_URL}/analytics/branch/${selectedBranch}`;
      }

      const response =
        await fetch(
          endpoint,
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

          "Failed to load analytics"
        );
      }

      setAnalytics(data);

    } catch (error: any) {

      setError(error.message);

    } finally {

      setLoading(false);
    }
  };

  if (loading) {

    return (

      <h2
        style={{
          color: "#CCA25A",
          padding: "60px"
        }}
      >
        Loading analytics...
      </h2>
    );
  }

  if (error) {

    return (

      <h2
        style={{
          color: "#ff4d4d",
          padding: "60px"
        }}
      >
        {error}
      </h2>
    );
  }

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
            "72px",

          marginBottom:
            "50px",

          color:
            "#CCA25A",

          fontWeight:
            400
        }}
      >
        Analytics Dashboard
      </h1>

      {
        (
          user.role === "ADMIN" ||
          user.role === "HQ_MANAGER"
        ) && (

          <select
            value={selectedBranch}

            onChange={(e) =>
              setSelectedBranch(
                e.target.value
              )
            }

            style={selectStyle}
          >

            <option value="">
              All Branches
            </option>

            {

              branches.map((branch) => (

                <option
                  key={branch.id}
                  value={branch.id}
                >
                  {branch.name}
                </option>

              ))
            }

          </select>
        )
      }

      <div
        style={gridStyle}
      >

        <div style={cardStyle}>

          <h2>Total Customers</h2>

          <p style={numberStyle}>
            {analytics.totalCustomers}
          </p>

        </div>

        <div style={cardStyle}>

          <h2>Total Reservations</h2>

          <p style={numberStyle}>
            {analytics.totalReservations}
          </p>

        </div>

        <div style={cardStyle}>

          <h2>Total Revenue</h2>

          <p style={numberStyle}>
            {formatCurrency(analytics.totalRevenue)}
          </p>

        </div>

        <div style={cardStyle}>

          <h2>Total Chefs</h2>

          <p style={numberStyle}>
            {analytics.totalChefs || 0}
          </p>

        </div>

        {

          user.role !==
          "BRANCH_MANAGER" && (

            <div style={cardStyle}>

              <h2>Total Branches</h2>

              <p style={numberStyle}>
                {analytics.totalBranches}
              </p>

            </div>
          )
        }

      </div>

      <section
        style={{
          marginTop: "70px"
        }}
      >

        <h2 style={sectionTitle}>
          Reservation Status
        </h2>

        <div style={gridStyle}>

          <div style={statusCard}>
            <h3>Pending</h3>

            <p style={statusNumber}>
              {
                analytics.pendingReservations
              }
            </p>
          </div>

          <div style={statusCard}>
            <h3>Confirmed</h3>

            <p style={statusNumber}>
              {
                analytics.confirmedReservations
              }
            </p>
          </div>

          <div style={statusCard}>
            <h3>Preparing</h3>

            <p style={statusNumber}>
              {
                analytics.preparingReservations || 0
              }
            </p>
          </div>

          <div style={statusCard}>
            <h3>Ready</h3>

            <p style={statusNumber}>
              {
                analytics.readyReservations || 0
              }
            </p>
          </div>

          <div style={statusCard}>
            <h3>Completed</h3>

            <p style={statusNumber}>
              {
                analytics.completedReservations || 0
              }
            </p>
          </div>

          <div style={statusCard}>
            <h3>Cancelled</h3>

            <p style={statusNumber}>
              {
                analytics.cancelledReservations
              }
            </p>
          </div>

        </div>

      </section>

      <section
        style={{
          marginTop: "70px"
        }}
      >

        <h2 style={sectionTitle}>
          Operational Insights
        </h2>

        <div style={gridStyle}>

          <div style={insightCard}>

            <h3>
              Peak Reservation Hours
            </h3>

            <p>
              7 PM - 10 PM
            </p>

          </div>

          <div style={insightCard}>

            <h3>
              Most Popular Category
            </h3>

            <p>
              Steaks
            </p>

          </div>

          <div style={insightCard}>

            <h3>
              Kitchen Efficiency
            </h3>

            <p>
              High Performance
            </p>

          </div>

        </div>

      </section>

    </div>
  );
};

const gridStyle = {

  display:
    "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(260px, 1fr))",

  gap:
    "25px"
};

const cardStyle = {

  background:
    "#1f1a16",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius:
    "22px",

  padding:
    "32px",

  boxShadow:
    "0 0 25px rgba(0,0,0,0.35)"
};

const numberStyle = {

  fontSize:
    "54px",

  fontWeight:
    "bold",

  color:
    "#CCA25A",

  marginTop:
    "20px"
};

const sectionTitle = {

  fontSize:
    "46px",

  color:
    "#CCA25A",

  marginBottom:
    "35px",

  fontWeight:
    400
};

const statusCard = {

  background:
    "#1a1613",

  border:
    "1px solid rgba(255,255,255,0.06)",

  borderRadius:
    "18px",

  padding:
    "28px"
};

const statusNumber = {

  fontSize:
    "42px",

  color:
    "#CCA25A",

  marginTop:
    "16px"
};

const insightCard = {

  background:
    "#1f1a16",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius:
    "18px",

  padding:
    "28px",

  lineHeight:
    "1.8"
};

const selectStyle = {

  padding:
    "16px",

  marginBottom:
    "40px",

  background:
    "#1f1a16",

  color:
    "#f8f2dc",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius:
    "12px",

  minWidth:
    "300px",

  fontSize:
    "18px"
};

export default AnalyticsPage;
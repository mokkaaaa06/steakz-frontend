import { useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL;

export default function BranchManagementPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [dashboard, setDashboard] = useState<any>(null);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (!selectedBranchId) {
      setDashboard(null);
      setError("");
      return;
    }

    fetchBranchDashboard();
  }, [selectedBranchId]);

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true);
      const response = await fetch(
        `${API_BASE}/branches`,
        {
          headers: getAuthHeaders()
        }
      );

      const data = await response.json();
      setBranches(Array.isArray(data) ? data : []);
    } catch (fetchError: any) {
      console.error(fetchError);
      setBranches([]);
    } finally {
      setLoadingBranches(false);
    }
  };

  const fetchBranchDashboard = async () => {
    try {
      setLoadingDashboard(true);
      setError("");

      const response = await fetch(
        `${API_BASE}/branches/${selectedBranchId}/dashboard`,
        {
          headers: getAuthHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load dashboard");
      }

      setDashboard(data);
    } catch (fetchError: any) {
      setError(fetchError.message || "Failed to load branch dashboard");
      setDashboard(null);
    } finally {
      setLoadingDashboard(false);
    }
  };

  const branch =
    dashboard?.branch ||
    dashboard?.branchDetails ||
    dashboard;

  console.log("BranchManagement dashboard", dashboard);
  console.log("BranchManagement branch", branch);
  console.log("BranchManagement dashboard.branch", dashboard?.branch);
  console.log("BranchManagement dashboard.users", dashboard?.users);
  console.log("BranchManagement branch.users", branch?.users);

  const users =
    Array.isArray(branch?.users)
      ? branch.users
      : Array.isArray(dashboard?.users)
        ? dashboard.users
        : Array.isArray(dashboard?.branch?.users)
          ? dashboard.branch.users
          : [];

  const manager = users.find(
    (user: any) => user.role === "BRANCH_MANAGER"
  ) ?? null;

  const chefs =
    Array.isArray(dashboard?.chefs)
      ? dashboard.chefs
      : Array.isArray(dashboard?.assignedChefs)
        ? dashboard.assignedChefs
        : [];

  const statistics =
    dashboard?.statistics || {
      totalReservations: dashboard?.totalReservations,
      upcomingReservations: dashboard?.upcomingReservations,
      completedReservations: dashboard?.completedReservations,
      cancelledReservations: dashboard?.cancelledReservations,
      totalRevenue: dashboard?.totalRevenue
    };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Branch Management</h1>

      <div style={controlsStyle}>
        <div style={groupStyle}>
          <label style={labelStyle}>Select Branch</label>
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            style={selectStyle}
          >
            <option value="">Pick a branch</option>
            {branches.map((branch) => (
              <option
                key={branch.id || branch._id}
                value={branch.id || branch._id}
              >
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loadingBranches && (
        <p style={loadingText}>Loading branches…</p>
      )}

      {!loadingBranches && branches.length === 0 && (
        <p style={loadingText}>No branches available.</p>
      )}

      {!selectedBranchId && branches.length > 0 && (
        <p style={loadingText}>Select a branch to view its dashboard.</p>
      )}

      {selectedBranchId && (
        <>
          {loadingDashboard && (
            <p style={loadingText}>Loading branch dashboard…</p>
          )}

          {error && (
            <p style={errorStyle}>{error}</p>
          )}

          {!loadingDashboard && !error && dashboard && (
            <>
              <div style={cardGrid}>
                <div style={cardStyle}>
                  <h2>Branch Details</h2>
                  <p>
                    <strong>Name: </strong>
                    {branch?.name ?? "-"}
                  </p>
                  <p>
                    <strong>Location: </strong>
                    {branch?.location ?? "-"}
                  </p>
                  <p>
                    <strong>Capacity: </strong>
                    {branch?.capacity ?? "-"}
                  </p>
                  <p>
                    <strong>Opening Hour: </strong>
                    {branch?.openingHour ?? "-"}
                  </p>
                  <p>
                    <strong>Closing Hour: </strong>
                    {branch?.closingHour ?? "-"}
                  </p>
                </div>

                <div style={cardStyle}>
                  <h2>Branch Manager</h2>
                  {manager ? (
                    <>
                      <p>
                        <strong>Name: </strong>
                        {manager.name}
                      </p>
                      <p>
                        <strong>Email: </strong>
                        {manager.email}
                      </p>
                      <p>
                        <strong>Role: </strong>
                        {manager.role}
                      </p>
                    </>
                  ) : (
                    <p>No manager assigned</p>
                  )}
                </div>

                <div style={cardStyle}>
                  <h2>Statistics</h2>
                  <p>
                    <strong>Total Reservations: </strong>
                    {statistics?.totalReservations ?? "-"}
                  </p>
                  <p>
                    <strong>Upcoming Reservations: </strong>
                    {statistics?.upcomingReservations ?? "-"}
                  </p>
                  <p>
                    <strong>Completed Reservations: </strong>
                    {statistics?.completedReservations ?? "-"}
                  </p>
                  <p>
                    <strong>Cancelled Reservations: </strong>
                    {statistics?.cancelledReservations ?? "-"}
                  </p>
                </div>

                <div style={cardStyle}>
                  <h2>Revenue</h2>
                  <p style={revenueStyle}>
                    £
                    {statistics?.totalRevenue != null
                      ? Number(statistics.totalRevenue).toFixed(2)
                      : "-"}
                  </p>
                </div>
              </div>

              <div style={tableSection}>
                <h2>Assigned Chefs</h2>

                {chefs.length === 0 ? (
                  <p style={loadingText}>No chefs assigned.</p>
                ) : (
                  <div style={tableWrapperStyle}>
                    <div style={tableHeaderStyle}>
                      <span>Name</span>
                      <span>Email</span>
                    </div>

                    {chefs.map((chef: any) => (
                      <div
                        key={chef.id || chef._id}
                        style={tableRowStyle}
                      >
                        <span>{chef.name}</span>
                        <span>{chef.email}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

const pageStyle = {
  padding: "50px",
  minHeight: "100vh",
  background: "#14110f",
  color: "#f8f2dc"
};

const titleStyle = {
  fontSize: "64px",
  color: "#CCA25A",
  marginBottom: "40px",
  fontWeight: 400
};

const controlsStyle = {
  display: "flex",
  justifyContent: "flex-start",
  marginBottom: "30px"
};

const groupStyle = {
  display: "flex" as const,
  flexDirection: "column" as const,
  gap: "10px",
  maxWidth: "400px"
};

const labelStyle = {
  fontSize: "18px",
  color: "#d6c6a5"
};

const selectStyle = {
  background: "#1e1813",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  color: "#f8f2dc",
  padding: "16px 18px",
  fontSize: "18px",
  outline: "none"
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "24px",
  marginBottom: "40px"
};

const cardStyle = {
  background: "#1f1a16",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "20px",
  padding: "28px"
};

const revenueStyle = {
  fontSize: "36px",
  color: "#CCA25A",
  marginTop: "10px"
};

const tableSection = {
  marginTop: "40px"
};

const tableWrapperStyle = {
  display: "grid",
  gap: "10px",
  marginTop: "16px"
};

const tableHeaderStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  padding: "18px 20px",
  borderBottom: "1px solid rgba(255,255,255,0.14)",
  fontWeight: 700,
  color: "#CCA25A"
};

const tableRowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  padding: "18px 20px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  alignItems: "center"
};

const loadingText = {
  color: "#d6c6a5",
  marginTop: "12px"
};

const errorStyle = {
  color: "#ff4d4d",
  marginTop: "20px"
};

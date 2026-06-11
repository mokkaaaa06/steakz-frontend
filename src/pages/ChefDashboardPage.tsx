import {
  useEffect,
  useState
} from "react";

export default function ChefDashboardPage() {
  const [upcomingShifts, setUpcomingShifts] =
    useState<any[]>([]);
  const [previousShifts, setPreviousShifts] =
    useState<any[]>([]);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const user =
    JSON.parse(
      localStorage.getItem("user") || "null"
    );

  useEffect(() => {
    if (user?.id) {
      fetchShifts();
    }
  }, [user?.id]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`
    };
  };

  const fetchShifts =
    async () => {
      if (!user?.id) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/shifts/${user.id}`,
            {
              headers: getAuthHeaders()
            }
          );

        if (!response.ok) {
          throw new Error("Failed to load shifts");
        }

        const data = await response.json();

        const now = new Date();

        const upcoming = data.filter(
          (shift: any) =>
            new Date(shift.startTime) >= now
        );

        const previous = data.filter(
          (shift: any) =>
            new Date(shift.startTime) < now
        );

        setUpcomingShifts(upcoming);
        setPreviousShifts(previous);
      } catch (fetchError: any) {
        console.error(fetchError);
        setError(fetchError.message || "Unable to load shifts.");
      } finally {
        setLoading(false);
      }
    };

  if (!user) {
    return null;
  }

  return (
    <div
      style={{
        padding: "50px",
        background: "#14110f",
        minHeight: "100vh",
        color: "#f8f2dc"
      }}
    >
      <h1
        style={{
          fontSize: "64px",
          color: "#CCA25A",
          marginBottom: "50px",
          fontWeight: 400
        }}
      >
        Chef Dashboard
      </h1>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      <section style={{ marginBottom: "60px" }}>
        <h2 style={sectionTitle}>Upcoming Shifts</h2>

        {loading ? (
          <p>Loading shifts...</p>
        ) : upcomingShifts.length === 0 ? (
          <p style={emptyStyle}>No upcoming shifts.</p>
        ) : (
          <div style={gridStyle}>
            {upcomingShifts.map((shift) => (
              <div key={shift.id} style={cardStyle}>
                <h3>Upcoming Shift</h3>
                <p>
                  Branch: {shift.branch?.name || user.branchName || "Assigned Branch"}
                </p>
                <p>Start:</p>
                <p>{new Date(shift.startTime).toLocaleString()}</p>
                <p style={{ marginTop: "20px" }}>End:</p>
                <p>{new Date(shift.endTime).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={sectionTitle}>Previous Shifts</h2>

        {loading ? (
          <p>Loading shifts...</p>
        ) : previousShifts.length === 0 ? (
          <p style={emptyStyle}>No previous shifts.</p>
        ) : (
          <div style={gridStyle}>
            {previousShifts.map((shift) => (
              <div key={shift.id} style={cardStyle}>
                <h3>Previous Shift</h3>
                <p>
                  Branch: {shift.branch?.name || user.branchName || "Assigned Branch"}
                </p>
                <p>Start:</p>
                <p>{new Date(shift.startTime).toLocaleString()}</p>
                <p style={{ marginTop: "20px" }}>End:</p>
                <p>{new Date(shift.endTime).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const sectionTitle = {
  fontSize: "42px",
  color: "#CCA25A",
  marginBottom: "30px",
  marginTop: "0"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "30px"
};

const cardStyle = {
  background: "#1f1a16",
  padding: "30px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.08)"
};

const emptyStyle = {
  color: "#d6c6a5",
  padding: "16px 0"
};

const errorStyle = {
  color: "#ffb3b3",
  marginBottom: "24px"
};


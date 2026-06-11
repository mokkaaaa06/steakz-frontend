import {
  useEffect,
  useState
} from "react";

import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser
} from "../api/authApi";

const ROLE_OPTIONS = [
  "CUSTOMER",
  "CHEF",
  "BRANCH_MANAGER",
  "HQ_MANAGER",
  "ADMIN"
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "CUSTOMER",
    branchId: ""
  });
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBranches();
    fetchAllUsers();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/branches`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setBranches(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error(error);
      setBranches([]);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data || []);
    } catch (error: any) {
      alert(error.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setSelectedUser(null);
    setForm({
      name: "",
      email: "",
      role: "CUSTOMER",
      branchId: ""
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (selectedUser) {
        await updateUser(selectedUser.id, form);
      } else {
        await createUser(form);
      }

      resetForm();
      await fetchAllUsers();
    } catch (error: any) {
      alert(error.message || "User save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "CUSTOMER",
      branchId: user.branchId || user.branch?.id || user.branch?._id || ""
    });
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      setLoading(true);
      await deleteUser(userId);
      await fetchAllUsers();
    } catch (error: any) {
      alert(error.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>User Management</h1>

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={inputStyle}
        >
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <select
          name="branchId"
          value={form.branchId}
          onChange={handleChange}
          style={inputStyle}
          disabled={form.role === "ADMIN" || form.role === "HQ_MANAGER"}
        >
          <option value="">Select Branch</option>
          {branches.map((branch) => (
            <option
              key={branch.id || branch._id}
              value={branch.id || branch._id}
            >
              {branch.name}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <button type="submit" style={buttonStyle} disabled={loading}>
            {selectedUser ? "Save Changes" : "Create User"}
          </button>

          {selectedUser && (
            <button type="button" onClick={resetForm} style={cancelButtonStyle}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={tableWrapperStyle}>
        <div style={tableHeaderStyle}>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Branch</span>
          <span>Actions</span>
        </div>

        {loading && <div style={loadingStyle}>Loading users...</div>}

        {!loading && users.length === 0 && (
          <div style={emptyStyle}>No users found.</div>
        )}

        {users.map((user) => (
          <div key={user.id} style={tableRowStyle}>
            <span>{user.name}</span>
            <span>{user.email}</span>
            <span>{user.role}</span>
            <span>
              {user.branch?.name || branches.find((branch) =>
                String(branch.id || branch._id) ===
                String(user.branchId || user.branch?.id || user.branch?._id)
              )?.name || user.branchId || "-"}
            </span>
            <span style={actionCellStyle}>
              <button onClick={() => handleEdit(user)} style={editButtonStyle}>
                Edit
              </button>
              <button onClick={() => handleDelete(user.id)} style={deleteButtonStyle}>
                Delete
              </button>
            </span>
          </div>
        ))}
      </div>
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
  fontSize: "60px",
  color: "#CCA25A",
  marginBottom: "30px"
};

const formStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "18px",
  marginBottom: "40px"
};

const inputStyle = {
  background: "#1e1813",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  color: "#f8f2dc",
  padding: "16px 18px",
  fontSize: "18px",
  outline: "none"
};

const buttonStyle = {
  background: "#CCA25A",
  border: "none",
  color: "#14110f",
  padding: "16px 24px",
  borderRadius: "14px",
  fontSize: "18px",
  cursor: "pointer",
  minWidth: "180px"
};

const cancelButtonStyle = {
  ...buttonStyle,
  background: "transparent",
  color: "#f8f2dc",
  border: "1px solid rgba(255,255,255,0.2)"
};

const tableWrapperStyle = {
  display: "grid",
  gap: "12px"
};

const tableHeaderStyle = {
  display: "grid",
  gridTemplateColumns: "2fr 2fr 1fr 1fr 2fr",
  gap: "12px",
  padding: "18px 20px",
  borderBottom: "1px solid rgba(255,255,255,0.14)",
  fontWeight: "700",
  color: "#CCA25A"
};

const tableRowStyle = {
  display: "grid",
  gridTemplateColumns: "2fr 2fr 1fr 1fr 2fr",
  gap: "12px",
  padding: "18px 20px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  alignItems: "center"
};

const actionCellStyle = {
  display: "flex",
  gap: "10px",
  justifyContent: "flex-end"
};

const editButtonStyle = {
  ...buttonStyle,
  background: "#3b7a3f"
};

const deleteButtonStyle = {
  ...buttonStyle,
  background: "#9b2e2e"
};

const loadingStyle = {
  gridColumn: "1 / -1",
  color: "#d6c6a5",
  padding: "20px"
};

const emptyStyle = {
  gridColumn: "1 / -1",
  color: "#d6c6a5",
  padding: "20px"
};

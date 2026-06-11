import { useEffect, useState } from "react";

const API_URL =
  `${import.meta.env.VITE_API_URL}/branches`;

export default function BranchesPage() {

  const [branches, setBranches] =
    useState<any[]>([]);

  const [name, setName] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [capacity, setCapacity] =
    useState("");

  const [openingHour, setOpeningHour] =
    useState("");

  const [closingHour, setClosingHour] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [editingBranchId,
    setEditingBranchId] =
      useState("");

  const token =
    localStorage.getItem("token");

  const fetchBranches =
    async () => {

      try {

        const response =
          await fetch(API_URL, {

            headers: {

              Authorization:
                `Bearer ${token}`
            }
          });

        const data =
          await response.json();

        setBranches(data);

      } catch (error: any) {

        setMessage(
          "Failed to fetch branches"
        );
      }
    };

  useEffect(() => {

    fetchBranches();

  }, []);

  const saveBranch =
    async () => {

      try {

        const url =
          editingBranchId

            ? `${API_URL}/${editingBranchId}`

            : API_URL;

        const method =
          editingBranchId

            ? "PUT"

            : "POST";

        const response =
          await fetch(url, {

            method,

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body: JSON.stringify({

              name,

              location,

              capacity:
                Number(capacity),

              openingHour:
                Number(openingHour),

              closingHour:
                Number(closingHour)
            })
          });

        const data =
          await response.json();

        if (!response.ok) {

          setMessage(
            data.message
          );

          return;
        }

        setMessage(

          editingBranchId

            ? "Branch updated successfully"

            : "Branch created successfully"
        );

        setEditingBranchId("");

        setName("");
        setLocation("");
        setCapacity("");
        setOpeningHour("");
        setClosingHour("");

        fetchBranches();

      } catch (error: any) {

        setMessage(
          "Server error"
        );
      }
    };

  const handleEdit =
    (branch: any) => {

      setEditingBranchId(
        branch.id
      );

      setName(
        branch.name
      );

      setLocation(
        branch.location
      );

      setCapacity(
        String(branch.capacity)
      );

      setOpeningHour(
        String(branch.openingHour)
      );

      setClosingHour(
        String(branch.closingHour)
      );
    };

  const deleteBranch =
    async (id: string) => {

      try {

        const response =
          await fetch(

            `${API_URL}/${id}`,

            {

              method: "DELETE",

              headers: {

                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          setMessage(
            data.message
          );

          return;
        }

        setMessage(
          "Branch deleted"
        );

        fetchBranches();

      } catch (error: any) {

        setMessage(
          "Server error"
        );
      }
    };

  return (

    <div
      style={{

        padding: "30px"
      }}
    >

      <h1>
        Branch Management
      </h1>

      <div
        style={{

          display: "flex",

          flexDirection:
            "column",

          gap: "10px",

          maxWidth: "400px"
        }}
      >

        <input
          type="text"

          placeholder="Branch Name"

          value={name}

          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <input
          type="text"

          placeholder="Location"

          value={location}

          onChange={(e) =>
            setLocation(
              e.target.value
            )
          }
        />

        <input
          type="number"

          placeholder="Capacity"

          value={capacity}

          onChange={(e) =>
            setCapacity(
              e.target.value
            )
          }
        />

        <input
          type="number"

          placeholder="Opening Hour"

          value={openingHour}

          onChange={(e) =>
            setOpeningHour(
              e.target.value
            )
          }
        />

        <input
          type="number"

          placeholder="Closing Hour"

          value={closingHour}

          onChange={(e) =>
            setClosingHour(
              e.target.value
            )
          }
        />

        <button
          onClick={saveBranch}
        >

          {
            editingBranchId

              ? "Update Branch"

              : "Create Branch"
          }

        </button>
      </div>

      {message && (

        <p
          style={{

            color: "gold"
          }}
        >
          {message}
        </p>
      )}

      <hr />

      <h2>
        All Branches
      </h2>

      <div
        style={{

          display: "flex",

          flexDirection:
            "column",

          gap: "20px"
        }}
      >

        {branches.map(
          (branch) => (

            <div
              key={branch.id}

              style={{

                border:
                  "1px solid white",

                padding: "20px"
              }}
            >

              <h3>
                {branch.name}
              </h3>

              <p>
                Location:
                {" "}
                {branch.location}
              </p>

              <p>
                Capacity:
                {" "}
                {branch.capacity}
              </p>

              <p>
                Hours:
                {" "}
                {branch.openingHour}
                :00 -
                {" "}
                {branch.closingHour}
                :00
              </p>

              <div
                style={{

                  display: "flex",

                  gap: "10px",

                  marginTop: "15px"
                }}
              >

                <button
                  onClick={() =>
                    handleEdit(
                      branch
                    )
                  }
                >
                  Edit Branch
                </button>

                <button
                  onClick={() =>
                    deleteBranch(
                      branch.id
                    )
                  }
                >
                  Delete Branch
                </button>

              </div>

            </div>
          )
        )}
      </div>
    </div>
  );
}
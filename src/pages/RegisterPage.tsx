import { useState } from "react";



export default function RegisterPage() {

  

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const register = async () => {

    try {

      setMessage("");

      const response =
        await fetch(
          `${import.meta.env.VITE_API_URL}/auth/register-customer`,
          {

            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify({

                name,
                email,
                password,

                role:
                  "CUSTOMER"
              })
          }
        );

      const data =
        await response.json();

      console.log(data);

      if (!response.ok) {

        setMessage(
          data.message || "Registration failed"
        );

        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage(
        "Registration successful"
      );

      setTimeout(() => {

        window.location.href = "/";

      }, 1000);

    } catch (error) {

      console.log(error);

      setMessage(
        "Server error"
      );
    }
  };

  return (

    <div
      style={{

        minHeight:
          "100vh",

        display:
          "flex",

        justifyContent:
          "center",

        alignItems:
          "center",

        background:
          "#1a1714"
      }}
    >

      <div
        style={{

          width:
            "420px",

          background:
            "#211c17",

          padding:
            "40px",

          borderRadius:
            "24px",

          border:
            "1px solid rgba(255,255,255,0.08)"
        }}
      >

        <h1
          style={{

            color:
              "#CCA25A",

            textAlign:
              "center",

            marginBottom:
              "30px",

            fontSize:
              "52px"
          }}
        >
          Register
        </h1>

        <input
          type="text"

          placeholder="Full Name"

          value={name}

          onChange={(e) =>
            setName(e.target.value)
          }

          style={inputStyle}
        />

        <input
          type="email"

          placeholder="Email"

          value={email}

          onChange={(e) =>
            setEmail(e.target.value)
          }

          style={inputStyle}
        />

        <input
          type="password"

          placeholder="Password"

          value={password}

          onChange={(e) =>
            setPassword(e.target.value)
          }

          style={inputStyle}
        />

        <button
          onClick={register}

          style={buttonStyle}
        >
          Create Account
        </button>

        {message && (

          <p
            style={{

              marginTop:
                "20px",

              color:
                "#CCA25A",

              textAlign:
                "center",

              fontSize:
                "20px"
            }}
          >
            {message}
          </p>

        )}

      </div>

    </div>
  );
}

const inputStyle = {

  width:
    "100%",

  padding:
    "16px",

  marginBottom:
    "18px",

  background:
    "#1a1714",

  border:
    "1px solid rgba(255,255,255,0.08)",

  borderRadius:
    "12px",

  color:
    "#f8f2dc",

  fontSize:
    "18px",

  outline:
    "none"
};

const buttonStyle = {

  width:
    "100%",

  padding:
    "16px",

  border:
    "none",

  borderRadius:
    "12px",

  background:
    "#CCA25A",

  color:
    "#1a1714",

  fontSize:
    "20px",

  fontWeight:
    "bold",

  cursor:
    "pointer"
};
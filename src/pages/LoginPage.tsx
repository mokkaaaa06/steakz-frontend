import {
  useState
} from "react";



function LoginPage() {


  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleLogin =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        setError("");

        const response =
          await fetch(
            `${import.meta.env.VITE_API_URL}/auth/login-customer`,
            {

              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({

                  email,
                  password
                })
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          setError(
            data.message ||
            "Login failed"
          );

          return;
        }

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            data.user
          )
        );

        window.location.href = "/";

      } catch (err: any) {

        console.log(err);

        setError(
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
            "1px solid rgba(255,255,255,0.08)",

          boxShadow:
            "0 0 40px rgba(0,0,0,0.4)"
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
          Welcome Back
        </h1>

        <form
          onSubmit={
            handleLogin
          }
        >

          <input
            type="email"

            placeholder="Email"

            value={email}

            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }

            style={inputStyle}
          />

          <input
            type="password"

            placeholder="Password"

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

            style={inputStyle}
          />

          <button
            type="submit"

            style={buttonStyle}
          >
            Login
          </button>

        </form>

        {

          error && (

            <p
              style={{

                color:
                  "#FFB16E",

                marginTop:
                  "20px",

                textAlign:
                  "center",

                fontSize:
                  "18px"
              }}
            >
              {error}
            </p>
          )
        }

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
    "pointer",

  transition:
    "0.3s"
};

export default LoginPage;
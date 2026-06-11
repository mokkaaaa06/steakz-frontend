import { Link } from "react-router-dom";

export default function DashboardPage() {

  return (

    <div
      style={{

        minHeight:
          "100vh",

        background:
          "#1a1714",

        color:
          "#f8f2dc"
      }}
    >

      <section
        style={{

          position:
            "relative",

          height:
            "88vh",

          backgroundImage:
            "url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop')",

          backgroundSize:
            "cover",

          backgroundPosition:
            "center",

          display:
            "flex",

          justifyContent:
            "center",

          alignItems:
            "center",

          textAlign:
            "center"
        }}
      >

        <div
          style={{

            position:
              "absolute",

            inset:
              0,

            background:
              "rgba(0,0,0,0.60)"
          }}
        />

        <div
          style={{

            position:
              "relative",

            zIndex:
              2,

            maxWidth:
              "900px",

            padding:
              "20px"
          }}
        >

          <h1
            style={{

              fontSize:
                "110px",

              color:
                "#CCA25A",

              marginBottom:
                "20px",

              letterSpacing:
                "10px",

              fontWeight:
                400
            }}
          >
            STEAKZ
          </h1>

          <p
            style={{

              fontSize:
                "30px",

              lineHeight:
                "1.8",

              color:
                "#f4e7c5",

              marginBottom:
                "40px"
            }}
          >
            A luxury steakhouse experience inspired by
            Barcelona nightlife, cinematic interiors,
            premium cuts, and unforgettable evenings.
          </p>

          <div
            style={{

              display:
                "flex",

              justifyContent:
                "center",

              gap:
                "20px",

              flexWrap:
                "wrap"
            }}
          >

            <Link
              to="/menu"

              style={buttonStyle}
            >
              Explore Menu
            </Link>

            <Link
              to="/reservations"

              style={secondaryButton}
            >
              Reserve Table
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

const buttonStyle = {

  background:
    "#CCA25A",

  color:
    "#1a1714",

  padding:
    "18px 40px",

  textDecoration:
    "none",

  borderRadius:
    "14px",

  fontSize:
    "22px",

  fontWeight:
    "bold",

  transition:
    "0.3s"
};

const secondaryButton = {

  background:
    "transparent",

  color:
    "#f8f2dc",

  padding:
    "18px 40px",

  textDecoration:
    "none",

  border:
    "1px solid rgba(255,255,255,0.25)",

  borderRadius:
    "14px",

  fontSize:
    "22px"
};
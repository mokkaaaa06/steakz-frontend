import {
  useEffect,
  useState
} from "react";

import {
  getMenuItems
} from "../api/menuApi";

export default function MenuPage() {

  const [items, setItems] =
    useState<any[]>([]);

  const formatCurrency = (value: any) =>
    `£${Number(value).toFixed(2)}`;

  useEffect(() => {

    fetchItems();

  }, []);

  const fetchItems =
    async () => {

      const data =
        await getMenuItems();

      setItems(data);
    };

  return (

    <div
      style={{

        padding:
          "60px 40px",

        background:
          "#14110f",

        minHeight:
          "100vh"
      }}
    >

      <h1
        style={{

          textAlign:
            "center",

          fontSize:
            "72px",

          color:
            "#CCA25A",

          marginBottom:
            "60px",

          fontWeight:
            400
        }}
      >
        Our Menu
      </h1>

      <div
        style={{

          display:
            "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",

          gap:
            "40px"
        }}
      >

        {

          items.map((item) => (

            <div
              key={item.id}

              style={cardStyle}
            >

              <img
                src={item.image}

                alt={item.name}

                style={imageStyle}
              />

              <div
                style={{
                  padding: "25px"
                }}
              >

                <h2
                  style={titleStyle}
                >
                  {item.name}
                </h2>

                <p
                  style={categoryStyle}
                >
                  {item.category}
                </p>

                <p
                  style={descriptionStyle}
                >
                  {item.description}
                </p>

                <h3
                  style={priceStyle}
                >
                  {formatCurrency(item.price)}
                </h3>

              </div>

            </div>

          ))
        }

      </div>

    </div>
  );
}

const cardStyle = {

  background:
    "#1f1a16",

  borderRadius:
    "24px",

  overflow:
    "hidden" as const,

  border:
    "1px solid rgba(255,255,255,0.08)",

  boxShadow:
    "0 0 25px rgba(0,0,0,0.35)"
};

const imageStyle = {

  width:
    "100%",

  height:
    "280px",

  objectFit:
    "cover" as const
};

const titleStyle = {

  color:
    "#f8f2dc",

  fontSize:
    "36px",

  marginBottom:
    "10px",

  fontWeight:
    400
};

const categoryStyle = {

  color:
    "#CCA25A",

  marginBottom:
    "16px",

  fontSize:
    "18px",

  letterSpacing:
    "2px"
};

const descriptionStyle = {

  color:
    "#d8cfb5",

  lineHeight:
    "1.8",

  marginBottom:
    "20px",

  fontSize:
    "18px"
};

const priceStyle = {

  color:
    "#CCA25A",

  fontSize:
    "30px"
};
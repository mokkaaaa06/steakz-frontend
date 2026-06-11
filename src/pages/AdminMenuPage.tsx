import {
  useEffect,
  useState
} from "react";

import {

  getMenuItems,
  createMenuItem,
  deleteMenuItem

} from "../api/menuApi";

export default function AdminMenuPage() {

  const [items, setItems] =
    useState<any[]>([]);

  const [form, setForm] =
    useState({

      name: "",
      description: "",
      price: "",
      image: "",
      category: ""
    });

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

  const handleChange =
    (
      e: any
    ) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value
      });
    };

  const handleCreate =
    async (
      e: any
    ) => {

      e.preventDefault();

      await createMenuItem(form);

      setForm({

        name: "",
        description: "",
        price: "",
        image: "",
        category: ""
      });

      fetchItems();
    };

  const handleDelete =
    async (
      id: string
    ) => {

      await deleteMenuItem(id);

      fetchItems();
    };

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
            "60px",

          color:
            "#CCA25A",

          marginBottom:
            "40px"
        }}
      >
        Menu Management
      </h1>

      <form
        onSubmit={
          handleCreate
        }

        style={formStyle}
      >

        <input
          name="name"
          placeholder="Dish Name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={textareaStyle}
        />

        <button
          type="submit"
          style={buttonStyle}
        >
          Add Dish
        </button>

      </form>

      <div
        style={{

          display:
            "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",

          gap:
            "30px",

          marginTop:
            "60px"
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
                  padding: "20px"
                }}
              >

                <h2>
                  {item.name}
                </h2>

                <p>
                  {item.category}
                </p>

                <p>
                  {formatCurrency(item.price)}
                </p>

                <button
                  onClick={() =>
                    handleDelete(item.id)
                  }

                  style={deleteStyle}
                >
                  Delete
                </button>

              </div>

            </div>

          ))
        }

      </div>

    </div>
  );
}

const formStyle = {

  display:
    "flex",

  flexDirection:
    "column" as const,

  gap:
    "20px",

  maxWidth:
    "700px"
};

const inputStyle = {

  padding:
    "18px",

  background:
    "#1f1a16",

  border:
    "1px solid rgba(255,255,255,0.08)",

  color:
    "#f8f2dc",

  borderRadius:
    "12px",

  fontSize:
    "18px"
};

const textareaStyle = {

  ...inputStyle,

  height:
    "140px"
};

const buttonStyle = {

  background:
    "#CCA25A",

  color:
    "#14110f",

  border:
    "none",

  padding:
    "18px",

  borderRadius:
    "12px",

  cursor:
    "pointer",

  fontSize:
    "18px",

  fontWeight:
    "bold"
};

const cardStyle = {

  background:
    "#1f1a16",

  borderRadius:
    "20px",

  overflow:
    "hidden" as const
};

const imageStyle = {

  width:
    "100%",

  height:
    "240px",

  objectFit:
    "cover" as const
};

const deleteStyle = {

  marginTop:
    "20px",

  background:
    "#8B0000",

  color:
    "white",

  border:
    "none",

  padding:
    "12px 18px",

  borderRadius:
    "10px",

  cursor:
    "pointer"
};
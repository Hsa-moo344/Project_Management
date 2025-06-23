import React, { useState, useEffect } from "react";
import ProfileCss from "../css/staff.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Fundraising() {
  const [formItemData, setItemFormData] = useState({
    itemId: "",
    ItemName: "",
    ItemDescription: "",
    image: "",
    ItemIn: "",
    ItemOut: "",
    Balance: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For zoomed modal
  const [itemList, setItemList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchItem = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/fundraisingfunction"
      );
      setItemList(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formItemData,
      [name]: value,
    };
    const itemIn = parseInt(newFormData.ItemIn) || 0;
    const itemOut = parseInt(newFormData.ItemOut) || 0;
    newFormData.Balance = itemIn - itemOut;
    setItemFormData(newFormData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in formItemData) {
      if (key !== "image") {
        formData.append(key, formItemData[key]);
      }
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8000/api/fundraisingfunction/${editingId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Updated successfully!");
      } else {
        await axios.post(
          "http://localhost:8000/api/fundraisingfunction",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Submitted successfully!");
      }

      setItemFormData({
        itemId: "",
        ItemName: "",
        ItemDescription: "",
        image: "",
        ItemIn: "",
        ItemOut: "",
        Balance: "",
      });
      setImageFile(null);
      setImagePreview(null);
      setEditingId(null);
      fetchItem();
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to submit");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setItemFormData({
      itemId: item.itemId,
      ItemName: item.ItemName,
      ItemDescription: item.ItemDescription,
      image: item.image,
      ItemIn: item.ItemIn,
      ItemOut: item.ItemOut,
      Balance: item.Balance,
    });
    if (item.image) {
      setImagePreview(`http://localhost:8000${item.image}`);
    }
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setItemFormData({
      itemId: "",
      ItemName: "",
      ItemDescription: "",
      image: "",
      ItemIn: "",
      ItemOut: "",
      Balance: "",
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(
          `http://localhost:8000/api/fundraisingfunction/${id}`
        );
        fetchItem();
      } catch (err) {
        console.error("Error deleting:", err);
      }
    }
  };

  const filteredItems = itemList.filter(
    (item) =>
      item.ItemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ItemDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={ProfileCss.MainFundraising}>
      <h2>Fundraising Item Entry Form</h2>

      <form className={ProfileCss.FundraisingMain} onSubmit={handleSubmit}>
        <label>
          Item Name:
          <input
            type="text"
            name="ItemName"
            value={formItemData.ItemName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Item Description:
          <textarea
            name="ItemDescription"
            value={formItemData.ItemDescription}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Upload Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {imagePreview && imageFile && (
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div>
        )}

        <label>
          Item In:
          <input
            type="number"
            name="ItemIn"
            value={formItemData.ItemIn}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Item Out:
          <input
            type="number"
            name="ItemOut"
            value={formItemData.ItemOut}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Balance:
          <input
            type="number"
            name="Balance"
            value={formItemData.Balance}
            readOnly
          />
        </label>

        <div className={ProfileCss.ButtonGroup}>
          <button type="submit" className={ProfileCss.ActionButton}>
            {editingId ? "Update Item" : "Submit Item"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className={ProfileCss.CancelButton}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <input
        type="text"
        placeholder="Search by name or description"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginTop: "20px", padding: "5px", width: "300px" }}
      />

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {filteredItems.length === 0 && <p>No items found.</p>}
        {filteredItems.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "6px",
              width: "220px",
            }}
          >
            <img
              src={`http://localhost:8000${item.image}`}
              alt={item.ItemName}
              style={{
                width: "100%",
                height: "100px",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() =>
                setImagePreview(`http://localhost:8000${item.image}`)
              }
            />
            <h4>{item.ItemName}</h4>
            <p>{item.ItemDescription}</p>
            <p>In: {item.ItemIn}</p>
            <p>Out: {item.ItemOut}</p>
            <p>Balance: {item.Balance}</p>
            <button
              onClick={() => handleEdit(item)}
              style={{
                backgroundColor: "blue",
                marginLeft: "10px",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              style={{
                marginLeft: "10px",
                backgroundColor: "#f70d3f",
                color: "#fff",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Modal for zoomed image */}
      {imagePreview && !imageFile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setImagePreview(null)}
              style={{
                position: "absolute",
                top: "-30px",
                right: "-30px",
                background: "#fff",
                border: "none",
                borderRadius: "50%",
                fontSize: "20px",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                boxShadow: "0 0 5px #000",
              }}
              title="Close"
            >
              ❌
            </button>
            <img
              src={imagePreview}
              alt="Full view"
              style={{
                maxWidth: "80vw",
                maxHeight: "80vh",
                borderRadius: "8px",
                boxShadow: "0 0 10px #fff",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Fundraising;

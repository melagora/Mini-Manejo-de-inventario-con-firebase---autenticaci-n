import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth_user } from "../firebase/appConfig";
import Login from "../pages/session/Login";
import "../pages/session/Styles/login.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", description: "" });
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth_user, (userFirebase) => {
      if (userFirebase) {
        setUser(userFirebase);
        localStorage.setItem("user_firebase", JSON.stringify(userFirebase));
        fetchProducts();
      } else {
        setUser(null);
        localStorage.removeItem("user_firebase");
      }
    });
  }, []);

  const logout = () => {
    signOut(auth_user)
      .then(() => {
        alert("La sesión se ha cerrado");
        localStorage.removeItem("user_firebase");
        setUser(null);
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const openModal = (product = null) => {
    setShowModal(true);
    if (product) {
      setIsEditing(true);
      setCurrentProduct(product);
      setNewProduct({ name: product.name, description: product.description });
    } else {
      setIsEditing(false);
      setNewProduct({ name: "", description: "" });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setNewProduct({ name: "", description: "" });
    setIsEditing(false);
    setCurrentProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.description) {
      try {
        await addDoc(collection(db, "products"), newProduct);
        fetchProducts();
        closeModal();
      } catch (error) {
        console.error("Error al agregar el producto:", error);
      }
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.description) {
      try {
        const productDoc = doc(db, "products", currentProduct.id);
        await updateDoc(productDoc, newProduct);
        fetchProducts();
        closeModal();
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
      }
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const userStorage = JSON.parse(localStorage.getItem("user_firebase"));

  return user ? (
    <div className="general">
      <h2>Lista de Productos</h2>
      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <button onClick={() => openModal(product)}>Editar</button>
          <button
            onClick={() => deleteProduct(product.id)}
            style={{ marginLeft: "10px", color: "red" }}
          >
            Eliminar
          </button>
        </div>
      ))}
      <div className="btnSesionIniciada">
        <div className="btnSesionIniciada1">
          <button onClick={() => openModal()}>Agregar producto</button>
        </div>
        <div className="btnSesionIniciada2">
          <button onClick={logout}>Cerrar sesión</button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? "Editar producto" : "Agregar nuevo producto"}</h3>
            <form onSubmit={isEditing ? updateProduct : addProduct}>
              <div className="agregarProducto">
                <div className="agregarProductoNombre">
                  <div>
                    <label>Nombre:</label>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="agregarProductoDescription">
                  <div>
                    <label>Descripción:</label>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="botonesProductos">
                <div className="botonesProductos1">
                  <button type="submit">Guardar</button>
                </div>
                <div className="botonesProductos2">
                  <button type="button" onClick={closeModal}>
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  ) : (
    <Login />
  );
}

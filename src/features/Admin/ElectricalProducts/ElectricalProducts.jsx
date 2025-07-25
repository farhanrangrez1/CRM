import axios from "axios";
import React, { useState, useEffect } from "react";
import { BiLoader } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { apiInventoryUrl } from "../../../redux/utils/config";


const ElectricalProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${apiInventoryUrl}/category/getAllCategories`);
        setCategories(res.data.data);
      } catch (error) {
        console.error("Category fetch error:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${apiInventoryUrl}/product/getAllProducts`);
        setProducts(res?.data?.data);
        setFilteredProducts(res.data.data);
      } catch (error) {
        console.error("Product fetch error:", error);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category_name) // use category_name instead of product.category
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    if (sortOption === "az") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "za") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategories, searchTerm, sortOption]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <>
      <div className="">
        <div className="container-fluid mt-2">
          <div className="row p-4">
            {/* Sidebar */}
            <div className="col-lg-3">
              <div className="card shadow-sm" style={{ borderRadius: '20px' }}>
                <div className="card-body" >
                  <h2 className="h4 fw-semibold mb-4">Filter Products</h2>

                  {/* Categories */}
                  <div className="mb-4" >
                    <h3 className="h6 fw-semibold mb-3">Categories</h3>
                    {categories.map((category, index) => (
                      <div className="form-check mb-2" key={index}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedCategories.includes(category.name)}
                          onChange={() => toggleCategory(category.name)}
                          id={`category${index}`}
                        />
                        <label className="form-check-label ms-2" htmlFor={`category${index}`}>
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Listing */}
            <div className="col-lg-9">
              <div className="row mb-4 g-3">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text bg-white rounded-pill me-2">
                      <FaSearch className="text-secondary" />
                    </span>
                    <input
                      type="text"
                      className="form-control py-2 rounded-pill"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select rounded-pill"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="">Sort by</option>
                    <option value="az">Name: A to Z</option>
                    <option value="za">Name: Z to A</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div className="col" key={product.id}>
                      <div className="card h-100 shadow-sm" style={{ borderRadius: "20px" }}>
                        <div
                          className="card-img-top"
                          style={{
                            height: '14rem',
                            backgroundImage: `url('${product.image[0]}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderTopLeftRadius: '20px',
                            borderTopRightRadius: '20px',
                          }}
                        />
                        <div className="card-body d-flex flex-column">
                          <div className="d-flex align-items-center mb-2">
                            <span className="badge bg-primary bg-opacity-10 me-auto mb-2">
                              {product.category_name}
                            </span>
                          </div>
                          <h5 className="card-title fw-semibold mb-2 fw-bold">
                            {product?.name?.slice(0, 60)}{product?.name?.length > 60 ? "..." : ""}</h5>

                          <p className="card-text mb-3 flex-grow-1">{product.description.length > 100
                            ? product.description.slice(0, 100) + "..." : product.description}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold text-primary">${product.price}</span>
                            <Link to={`/admin/productpage/${product.id}`} className="btn btn-primary btn-sm">
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center"><BiLoader /></p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ElectricalProducts;

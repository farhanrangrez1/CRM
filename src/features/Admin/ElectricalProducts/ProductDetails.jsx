import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RelatedProducts = ({ categoryId, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://inventory-backend-production-6cb7.up.railway.app/api/product/getAllProducts`);
        const allProducts = response.data.data;

        // Filter by categoryId and remove the current product
        const filtered = allProducts.filter(
          (product) => product.categoryId === categoryId && product.id !== currentProductId
        );

        setRelatedProducts(filtered);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchRelated();
    }
  }, [categoryId, currentProductId]);

  return (
    <div className="container-fluid mt-5 px-0 px-md-3">
      <div className="row">
        <div className="col-12">
          <h4 className="mb-4 fw-bold border-bottom pb-2">Related Products</h4>

          {loading ? (
            <div className="row">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="col-12 col-sm-6 col-lg-3 mb-4 d-flex">
                  <div className="card shadow-lg w-100 d-flex flex-column" style={{ borderRadius: "20px" }}>
                    <div
                      className="card-img-top rounded-top-3 placeholder"
                      style={{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '14rem',
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px',
                        backgroundColor: '#f5f5f5'
                      }}
                    ></div>
                    <div className="card-body d-flex flex-column">
                      <div className="mb-2 placeholder-wave">
                        <span className="badge bg-primary bg-opacity-10 text-white placeholder col-4"></span>
                      </div>
                      <h5 className="card-title mb-1 text-dark fw-semibold placeholder-glow">
                        <span className="placeholder col-8"></span>
                      </h5>
                      <p className="card-text text-muted small mb-3 placeholder-glow">
                        <span className="placeholder col-12"></span>
                        <span className="placeholder col-10"></span>
                      </p>
                      <div className="mt-auto d-flex justify-content-between align-items-center placeholder-wave">
                        <span className="text-primary fw-bold placeholder col-3"></span>
                        <button className="btn btn-primary btn-sm rounded-pill disabled placeholder col-4"></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="row">
              {relatedProducts.map((product) => (
                <div key={product.id} className="col-12 col-sm-6 col-lg-3 mb-4 d-flex">
                  <div className="card shadow-lg w-100 d-flex flex-column" style={{ borderRadius: "20px" }}>
                    <div
                      className="card-img-top rounded-top-3"
                      style={{
                        backgroundImage: `url(${product.image?.[0] || 'https://via.placeholder.com/300'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '14rem',
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px'
                      }}
                      onError={(e) => {
                        e.target.style.backgroundImage = "url('https://via.placeholder.com/300')";
                      }}
                    ></div>

                    <div className="card-body d-flex flex-column">
                      <div className="mb-2">
                        <span className="badge bg-primary bg-opacity-10 text-white">
                          {product.category_name || 'Category'}
                        </span>
                      </div>
                      <h5 className="card-title mb-1 text-dark fw-semibold">{product.name}</h5>
                      <p className="card-text text-muted small mb-3">
                        {product.description?.length > 60
                          ? `${product.description.substring(0, 60)}...`
                          : product.description}
                      </p>

                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <span className="text-primary fw-bold">₹{product.price}</span>
                        <Link
                          to={`/admin/productpage/${product.id}`}
                          className="btn btn-primary btn-sm rounded-pill"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              No related products found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
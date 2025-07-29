// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import RelatedProducts from './ProductDetails';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';
// import { BiLoader } from 'react-icons/bi';
// import { apiInventoryUrl } from '../../../redux/utils/config';
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";


// const stripePromise = loadStripe("pk_test_51QjO3HAkiLZQygvDSwucdMyDyPbxIHJBq2OUFL9cYV3OhWbxcIy3Zn84pjzC0r4CYvHQwvklMJmkxYFOLhGj1OBU00cL8KKeIN");

// const ProductPage = () => {
//   const { id } = useParams();
//   const [quantity, setQuantity] = useState(1);
//   const [product, setProduct] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null)
//   const navigate = useNavigate();
//   const increaseQuantity = () => setQuantity((prev) => prev + 1);
//   const [showCheckout, setShowCheckout] = useState(false);

//   const decreaseQuantity = () =>
//     setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value) || 1;
//     setQuantity(value > 0 ? value : 1);
//   };
//   // Fetch product details by ID
//   useEffect(() => {
//     const fetchProductById = async () => {
//       try {
//         const res = await axios.get(`${apiInventoryUrl}/product/getProductById/${id}`);
//         // console.log(res.data);
//         const data = res.data?.data;
//         setProduct(data);
//         if (data?.image?.length > 0) {
//           setSelectedImage(data.image[0]);
//         }
//       } catch (error) {
//         console.error('Error fetching product by ID:', error);
//       }
//     };
//     fetchProductById();
//   }, [id]);

//   if (!product) return <div className="text-center p-5"><BiLoader /></div>;



//   const totalAmount = (parseFloat(product.price) * quantity).toFixed(2);

//   const renderCheckout = showCheckout ? (
//     <Elements stripe={stripePromise}>
//       <CheckoutForm
//         cartItems={[{ ...product, quantity }]}
//         totalAmount={totalAmount}
//       />
//     </Elements>
//   ) : (
//     <button
//       className="btn btn-primary py-3 fw-medium"
//       onClick={() => setShowCheckout(true)}
//     >
//       Buy Now - ${totalAmount}
//     </button>
//   );


//   return (
//     <>
//       <ToastContainer />
//       <div className="bg-white">
//         <div className="p-5 mt-5 py-5">
//           <div className="row g-4">
//             {/* Product Images */}
//             <div className="col-lg-6">
//               <div className="position-relative mb-4">
//                 <img src={selectedImage} alt={product.name} className="img-fluid rounded bg-light object-contain"
//                   style={{ height: '400px', width: '100%', objectFit: 'contain', }} />
//               </div>
//               <div className="d-flex flex-wrap gap-3">
//                 {product?.image?.map((imgSrc, index) => (
//                   <div
//                     key={index}
//                     className={`border rounded ${selectedImage === imgSrc
//                       ? 'border-primary border-2'
//                       : 'border-light'
//                       }`}
//                     onClick={() => setSelectedImage(imgSrc)}
//                     style={{ width: '80px', height: '80px', cursor: 'pointer', }}>
//                     <img src={imgSrc} alt={`Product Thumbnail ${index + 1}`}
//                       className="img-fluid h-100 w-100 p-2 object-contain" />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Product Info */}
//             <div className="col-lg-6">
//               <h1 className="fw-bold mb-2">{product?.name}</h1>
//               <p className="text-muted mb-2">SKU: {product.sku}</p>
//               <p className="text-muted mb-2">Category: {product.category_name}</p>
//               <p className="text-muted small mb-0">  {product?.description} {product?.category_name} </p>

//               <div className="mb-3 mt-2">
//                 <span className="fs-3 fw-bold text-primary">
//                   ${parseFloat(product.price).toFixed(2)}
//                 </span>
//               </div>

//               <div className="mb-4">
//                 <label className="form-label">Quantity</label>
//                 <div className="d-flex align-items-center gap-3">
//                   <div className="d-flex align-items-center border rounded">
//                     <button className="btn btn-outline-secondary border-0 rounded-0"
//                       onClick={decreaseQuantity} >
//                       <i className="bi bi-dash"></i>
//                     </button>
//                     <input type="number" value={quantity} onChange={handleQuantityChange} min="1"
//                       className="form-control text-center border-0 shadow-none"
//                       style={{ width: '60px' }} />
//                     <button className="btn btn-outline-secondary border-0 rounded-0" onClick={increaseQuantity}>
//                       <i className="bi bi-plus"></i>
//                     </button>
//                   </div>
//                   <span className="text-muted small">
//                     {product.stockQuantity} available
//                   </span>
//                 </div>
//               </div>

//               <div className="d-grid gap-3 mb-4">
//                 {renderCheckout}
//               </div>

//               <div className="d-flex justify-content-between small text-muted pt-3 border-top">
//                 <div className="d-flex align-items-center gap-2">
//                   <i className="bi bi-truck"></i>
//                   <span>Free shipping on orders $75+</span>
//                 </div>
//                 <div className="d-flex align-items-center gap-2">
//                   <i className="bi bi-arrow-counterclockwise"></i>
//                   <span>30-day returns</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Related Products */}
//           <div className='mt-5'>
//             <RelatedProducts
//               categoryId={product.categoryId}
//               currentProductId={product.id}
//             />
//           </div>
//         </div>

//       </div>
//     </>
//   );
// };

// const CheckoutForm = ({ cartItems, totalAmount, setShowCheckout }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setLoading(true);
//     const user = JSON.parse(localStorage.getItem("InventoryUser"));
//     const userId = user?.id;
//     const cartId = cartItems.map((item) => item.id);

//     try {
//       const res = await axios.post(`${apiInventoryUrl}/stripe/createCartPayment`, {
//         userId,
//         cartId,
//         totalAmount,
//       });

//       const clientSecret = res.data.clientSecret;

//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: user.name,
//           },
//         },
//       });

//       if (result.error) {
//         alert(result.error.message);
//       } else if (result.paymentIntent.status === "succeeded") {
//         alert("Payment successful!");
//         setShowCheckout(false);
//         navigate('/admin/products')
//       }
//     } catch (error) {
//       console.error("Error during checkout:", error);
//       alert("Payment failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <CardElement className="form-control mb-3" />
//       <button className="btn btn-primary w-100" type="submit" disabled={!stripe || loading}>
//         {loading ? "Processing..." : `Pay $${totalAmount}`}
//       </button>
//     </form>
//   );
// };


// export default ProductPage;

// --- ProductPage.jsx ---

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RelatedProducts from './ProductDetails';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BiLoader } from 'react-icons/bi';
import { apiInventoryUrl } from '../../../redux/utils/config';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51QjO3HAkiLZQygvDSwucdMyDyPbxIHJBq2OUFL9cYV3OhWbxcIy3Zn84pjzC0r4CYvHQwvklMJmkxYFOLhGj1OBU00cL8KKeIN");

const ProductPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const res = await axios.get(`${apiInventoryUrl}/product/getProductById/${id}`);
        const data = res.data?.data;
        setProduct(data);
        if (data?.image?.length > 0) {
          setSelectedImage(data.image[0]);
        }
      } catch (error) {
        console.error('Error fetching product by ID:', error);
      }
    };
    fetchProductById();
  }, [id]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(value > 0 ? value : 1);
  };

  if (!product) return <div className="text-center p-5"><BiLoader /></div>;

  const totalAmount = (parseFloat(product.price) * quantity).toFixed(2);

  return (
    <>
      <ToastContainer />
      <div className="bg-white">
        <div className="p-5 mt-5 py-5">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="position-relative mb-4">
                <img src={selectedImage} alt={product.name} className="img-fluid rounded bg-light object-contain"
                  style={{ height: '400px', width: '100%', objectFit: 'contain' }} />
              </div>
              <div className="d-flex flex-wrap gap-3">
                {product?.image?.map((imgSrc, index) => (
                  <div
                    key={index}
                    className={`border rounded ${selectedImage === imgSrc ? 'border-primary border-2' : 'border-light'}`}
                    onClick={() => setSelectedImage(imgSrc)}
                    style={{ width: '80px', height: '80px', cursor: 'pointer' }}>
                    <img src={imgSrc} alt={`Product Thumbnail ${index + 1}`}
                      className="img-fluid h-100 w-100 p-2 object-contain" />
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-6">
              <h1 className="fw-bold mb-2">{product?.name}</h1>
              <p className="text-muted mb-2">SKU: {product.sku}</p>
              <p className="text-muted mb-2">Category: {product.category_name}</p>
              <p className="text-muted small mb-0">{product?.description}</p>

              <div className="mb-3 mt-2">
                <span className="fs-3 fw-bold text-primary">${parseFloat(product.price).toFixed(2)}</span>
              </div>

              <div className="mb-4">
                <label className="form-label">Quantity</label>
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center border rounded">
                    <button className="btn btn-outline-secondary border-0 rounded-0" onClick={decreaseQuantity}>
                      <i className="bi bi-dash"></i>
                    </button>
                    <input type="number" value={quantity} onChange={handleQuantityChange} min="1"
                      className="form-control text-center border-0 shadow-none" style={{ width: '60px' }} />
                    <button className="btn btn-outline-secondary border-0 rounded-0" onClick={increaseQuantity}>
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                  <span className="text-muted small">{product.stockQuantity} available</span>
                </div>
              </div>

              <div className="d-grid gap-3 mb-4">
                {showCheckout ? (
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      id={id}
                      cartItems={[{ ...product, quantity }]}
                      totalAmount={totalAmount}
                      setShowCheckout={setShowCheckout}
                    />
                  </Elements>
                ) : (
                  <button
                    className="btn btn-primary py-3 fw-medium"
                    onClick={() => setShowCheckout(true)}
                  >
                    Buy Now - ${totalAmount}
                  </button>
                )}
              </div>

              <div className="d-flex justify-content-between small text-muted pt-3 border-top">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-truck"></i>
                  <span>Free shipping on orders $75+</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-arrow-counterclockwise"></i>
                  <span>30-day returns</span>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-5'>
            <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
          </div>
        </div>
      </div>
    </>
  );
};

const CheckoutForm = ({ id, cartItems, totalAmount, setShowCheckout }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false); // ⬅️ NEW STATE
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const user = JSON.parse(localStorage.getItem("InventoryUser"));
    const userId = user?.id;
    const cartId = cartItems.map((item) => item.id);
    const productId = id;

    try {
      const res = await axios.post(`${apiInventoryUrl}/stripe/createCartPayment`, {
        productId,
        userId,
        cartId,
        totalAmount,
      });

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.name,
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setConfirming(true); // ⬅️ SHOW CONFIRM LOADER

        const response = await axios.post(`${apiInventoryUrl}/stripe/confirmPaymentStatus`, {
          paymentIntentId: result?.paymentIntent?.id,
        });

        if (response?.data?.status === "succeeded") {
          toast.success("Payment successful!");
          setShowCheckout(false);
          setTimeout(() => {
            navigate('/admin/myorders');
          }, 1000);
        } else {
          toast.error("Payment confirmation failed");
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="form-control mb-3" />
      <button className="btn btn-primary w-100" type="submit" disabled={!stripe || loading || confirming}>
        {(loading || confirming)
          ? <><span className="spinner-border spinner-border-sm me-2" role="status" />{confirming ? "Confirming Payment..." : "Processing..."}</>
          : `Pay $${totalAmount}`}
      </button>
    </form>
  );
};


export default ProductPage;

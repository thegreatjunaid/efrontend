// import { useCart } from "./Cartcontext"; // adjust path if needed

// export default function Cart() {

//    const { cartItems, removeFromCart, decreaseQuantity, totalPrice } = useCart();

//    return (
//       <div className="p-6">
//          <h1 className="text-3xl font-semibold mb-6">My Cart</h1>

//          {cartItems.length === 0 ? (
//             <p className="text-gray-500">Your cart is empty</p>
//          ) : (
//             <div className="space-y-4">
//                {cartItems.map(item => (
//                   <div key={item._id} className="flex gap-4 bg-white p-4 shadow rounded">

//                      {item.image && (
//                         <img
//                            src={item.image}
//                            alt={item.name}
//                            className="w-20 h-20 object-cover rounded"
//                         />
//                      )}

//                      <div className="flex-1">
//                         <h2 className="font-semibold">{item.name}</h2>
//                         <p>${item.price}</p>
//                         <p>Qty: {item.quantity}</p>

//                         <div className="flex gap-2 mt-2">
//                            <button
//                               onClick={() => decreaseQuantity(item._id)}
//                               className="px-3 py-1 bg-gray-200 rounded"
//                            >
//                               -
//                            </button>

//                            <button
//                               onClick={() => removeFromCart(item._id)}
//                               className="px-3 py-1 bg-red-500 text-white rounded"
//                            >
//                               Remove
//                            </button>
//                         </div>
//                      </div>

//                   </div>
//                ))}

//                <div className="text-xl font-bold mt-6">
//                   Total: ${totalPrice}
//                </div>
//             </div>
//          )}
//       </div>
//    );
// }

import { useCart } from "./Cartcontext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, decreaseQuantity } = useCart();

  // Track selected items
  const [selectedItems, setSelectedItems] = useState([]);

  // Toggle selection of items
  const toggleSelect = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Proceed with selected items
  const handleProceed = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to proceed");
      return;
    }

    // Only selected items go to checkout
    const itemsToCheckout = cartItems.filter((item) =>
      selectedItems.includes(item.productId)
    );

    if (itemsToCheckout.length === 0) {
      alert("No valid items selected");
      return;
    }

    // Calculate total for selected items
    const selectedTotal = itemsToCheckout.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Navigate to checkout page with selected items
    navigate("/checkout", { state: { items: itemsToCheckout, total: selectedTotal } });

    // Remove **only selected items** from cart
    itemsToCheckout.forEach((item) => removeFromCart(item.productId));

    // Clear selection
    setSelectedItems([]);
  };

  // Total for selected items (shown dynamically)
  const selectedTotalPrice = cartItems
    .filter((item) => selectedItems.includes(item.productId))
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">My Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 bg-white p-4 shadow rounded items-center"
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.productId)}
                onChange={() => toggleSelect(item.productId)}
                className="w-5 h-5"
              />

              {item.image && (
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}

              <div className="flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
                <p>Qty: {item.quantity}</p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => decreaseQuantity(item.productId)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Total only for selected items */}
          <div className="text-xl font-bold mt-6">
            Selected Total: ${selectedTotalPrice}
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={selectedItems.length === 0}
            className={`mt-4 w-full px-4 py-2 rounded text-white ${
              selectedItems.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
            }`}
          >
            Proceed to Order
          </button>
        </div>
      )}
    </div>
  );
}
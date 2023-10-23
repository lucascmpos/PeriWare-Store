"use client";

import { ProductWithTotalPrice } from "@/helpers/product";
import { createContext, ReactNode, useState } from "react";

export interface CartProduct extends ProductWithTotalPrice {
  quantity: number;
}

interface ICartContext {
  products: CartProduct[];
  cartTotalPrice: number;
  cartBasePrice: number;
  cartTotalDiscount: number;
  addProductToCart: (product: CartProduct) => void;
  increaseProductQuantity: (product: CartProduct) => void;
  decreaseProductQuantity: (product: CartProduct) => void;

}

export const cartContext = createContext<ICartContext>({
  products: [],
  cartTotalPrice: 0,
  cartBasePrice: 0,
  cartTotalDiscount: 0,
  addProductToCart: () => {},
  increaseProductQuantity: () => {},
  decreaseProductQuantity: () => {},
});

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([]);

  const addProductToCart = (product: CartProduct) => {
    const productAlreadyOnCart = products.some(
      (cartProduct) => cartProduct.id === product.id,
    );
    if (productAlreadyOnCart) {
      setProducts((prev) =>
        prev.map((cartProduct) => {
          if (cartProduct.id === product.id) {
            return {
              ...cartProduct,
              quantity: cartProduct.quantity + product.quantity,
            };
          }
          return cartProduct;
        }),
      );
      return;
    }
    setProducts((prev) => [...prev, product]);
  };

  const decreaseProductQuantity = (productId: string) => {
    setProducts((prev) =>
      prev.map((cartProduct) => {
          if (cartProduct.id === productId) {
            return { ...cartProduct, quantity: cartProduct.quantity - 1 };
          }
          return cartProduct;
        })
        .filter((cartProduct) => cartProduct.quantity > 0),
    );
  };

  const increaseProductQuantity = (productId: string) => {
    setProducts((prev) =>
      prev.map((cartProduct) => {
          if (cartProduct.id === productId) {
            return { 
                ...cartProduct,
                 quantity: cartProduct.quantity + 1 
                };
          }
          return cartProduct;
        }),
    );
  };
  return (
    <cartContext.Provider
      value={{
        products,
        addProductToCart,
        increaseProductQuantity,
        decreaseProductQuantity,
        cartTotalPrice: 0,
        cartBasePrice: 0,
        cartTotalDiscount: 0,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};

export default CartProvider;

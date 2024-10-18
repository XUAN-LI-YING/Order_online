import { createContext, useReducer } from 'react';

const CartContext = createContext({
  items: [],
  addItem: (item) => { },
  removeItem: (id) => { },
  clearCart: () => { },
});

function cartReducer(state, action) {

  // 增加該item數量
  if (action.type === 'ADD_ITEM') {

    // 檢查該item是不是已經存在在原本的點餐菜單中
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    // 要更新的猜單
    const updatedItems = [...state.items];
    //如果我正要新增的item，已經存在在菜單中 
    if (existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];

      // 更新該餐點的數量
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };

      updatedItems[existingCartItemIndex] = updatedItem;
    } else {

      // 如果該餐點不在原本的菜單中，則新增該餐點進菜單
      updatedItems.push({ ...action.item, quantity: 1 });

    }

    // 將state中的items屬性取代更新為最新的菜單
    return { ...state, items: updatedItems };
  }


  // 移除該餐點
  if (action.type === 'REMOVE_ITEM') {
    // 檢查該餐點在菜單中的哪裡
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items];

    // 如果該餐點數量為1
    if (existingCartItem.quantity === 1) {
      // 從index第existingCartItemIndex開始刪除1個元素
      updatedItems.splice(existingCartItemIndex, 1);
    } else {

      // 該餐點的數量超過1，就將數量-1
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };

      // 更新菜單中該餐點的資料
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    // 更新state中的item
    return { ...state, items: updatedItems };
  }

  // 清理菜單，把state item變為空
  if (action.type === 'CLEAR_CART') {
    return { ...state, items: [] };
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  function addItem(item) {
    dispatchCartAction({ type: 'ADD_ITEM', item });
  }

  function removeItem(id) {
    dispatchCartAction({ type: 'REMOVE_ITEM', id });
  }

  function clearCart() {
    dispatchCartAction({ type: 'CLEAR_CART' });
  }

  console.log(" cart.items", cart.items);

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;

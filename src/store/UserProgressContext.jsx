import { createContext, useState } from 'react';

// 可以跨層級傳遞的數據
const UserProgressContext = createContext({
  progress: '', // 'cart', 'checkout'
  showCart: () => { },
  hideCart: () => { },
  showCheckout: () => { },
  hideCheckout: () => { },
});

// {children}是 prop={children:...}的賦值解構
export function UserProgressContextProvider({ children }) {
  const [userProgress, setUserProgress] = useState('');

  function showCart() {
    setUserProgress('cart');
  }

  function hideCart() {
    setUserProgress('');
  }

  function showCheckout() {
    setUserProgress('checkout');
  }

  function hideCheckout() {
    setUserProgress('');
  }

  const userProgressCtx = {
    progress: userProgress,
    showCart,
    hideCart,
    showCheckout,
    hideCheckout,
  };

  return (
    <UserProgressContext.Provider value={userProgressCtx}>
      {/* 裡會動態渲染子元件 */}
      {children}
    </UserProgressContext.Provider>
  );
}

export default UserProgressContext;

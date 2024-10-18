import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children, open, onClose, className = '' }) {
  const dialog = useRef();

  useEffect(() => {
    // MODEL被指定為<dialog></dialog>節點
    const modal = dialog.current;
    console.log("model", modal);
    console.log("dialog", dialog);

    // <dialog></dialog>該節點顯示
    if (open) {
      modal.showModal();
    }
    // <dialog></dialog>該節點關閉
    return () => modal.close();
  }, [open]);

  return createPortal(

    <dialog ref={dialog} className={`modal ${className}`} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
}

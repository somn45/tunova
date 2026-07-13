import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, closeModal, children }: ModalProps) {
  if (!isOpen) return null;
  return createPortal(
    <div
      onClick={closeModal}
      className="fixed top-0 left-0 flex h-screen w-full items-center justify-center bg-black/60"
    >
      <section onClick={e => e.stopPropagation()} className="min-h-30 bg-white">
        {children}
      </section>
    </div>,
    document.getElementById("portal-root")!,
  );
}

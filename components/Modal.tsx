import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  closeModal,
  title = "모달 제목",
  children,
}: ModalProps) {
  if (!isOpen) return null;
  return createPortal(
    <div
      onClick={closeModal}
      className="fixed top-0 left-0 flex h-screen w-full items-center justify-center bg-black/60"
    >
      <section
        onClick={e => e.stopPropagation()}
        className="min-h-30 bg-white p-5"
      >
        <h2>{title}</h2>
        {children}
      </section>
    </div>,
    document.getElementById("portal-root")!,
  );
}

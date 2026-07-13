import Modal from "@/components/Modal";

export default function GetTrackModal({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) {
  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      트랙을 가져오는 과정을 수행할 예정입니다.
    </Modal>
  );
}

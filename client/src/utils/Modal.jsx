import { createPortal } from "react-dom";

const CustomModal = ({ setShow, children }) => {
  return createPortal(
    <Modal setShow={setShow}>{children}</Modal>,
    document.getElementById("models")
  );
};

const Modal = ({ children, setShow }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center"
      onClick={() => {
        setShow(false);
        setShow.setActiveAuthComponent("login");
      }}
    >
      {/* Prevents modal content click from closing the modal */}
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default CustomModal;

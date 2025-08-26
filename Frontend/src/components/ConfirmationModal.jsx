// src/components/ConfirmationModal.jsx
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box bg-gray-800 text-white">
                <h3 className="font-bold text-lg">Confirm Deletion</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action">
                    <button type="button" className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn-error" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
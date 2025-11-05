import React from "react";

interface DelTitleProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  titleId: string;
  isDeleting?: boolean;
}

export const DelTitle: React.FC<DelTitleProps> = ({
  isOpen,
  onClose,
  onDelete,
  titleId,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-md p-6 w-80 text-center shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Confirmar exclusão</h2>
        <p className="mb-6">Tem certeza que deseja excluir este título?</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => onDelete(titleId)}
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DelTitle;
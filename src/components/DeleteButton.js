import {useState} from "react";

export default function DeleteButton({label,onDelete}) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (showConfirm) {
    return (
      <div className="fixed bg-black/80 inset-0 flex items-center h-full justify-center">
        <div className="bg-white p-4 rounded-lg">
          <div>Bạn có chắc muốn xóa?</div>
          <div className="flex gap-2 mt-1">
            <button type="button" onClick={() => setShowConfirm(false)}>
              Thoát
            </button>
            <button
              onClick={() => {
                onDelete();
                setShowConfirm(false);
              }}
              type="button"
              className="primary">
              Xóa
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button className="bg-red-400 text-white" type="button" onClick={() => setShowConfirm(true)}>
      {label}
    </button>
  );
}
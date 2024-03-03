import React from "react";
import { useMutation } from "@apollo/client";
import { Button } from "@arch-ui/button";
import Confirm from "@arch-ui/confirm";

export default function DeleteItemModal({
  isOpen,
  item,
  list,
  onClose,
  onDelete,
}) {
  const [deleteItem, { loading }] = useMutation(list.deleteMutation, {
    refetchQueries: ["getList"],
  });

  return (
    <Confirm
      isOpen={isOpen}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !loading) {
          onClose();
        }
      }}
    >
      <p style={{ marginTop: 0 }}>
        Bạn chắc chắn muốn xóa <strong>{item._label_}</strong>?
      </p>
      <footer>
        <Button
          className="btn btn-danger"
          variant="ghost"
          onClick={async () => {
            if (loading) return;
            await deleteItem({ variables: { id: item.id } });
            onDelete();
          }}
        >
          Xóa
        </Button>
        <Button
          variant="subtle"
          onClick={() => {
            if (loading) return;
            onClose();
          }}
        >
          Thôi
        </Button>
      </footer>
    </Confirm>
  );
}

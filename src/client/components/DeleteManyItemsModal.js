import React from "react";
import { useMutation } from "@apollo/client";
import { Button } from "@arch-ui/button";
import Confirm from "@arch-ui/confirm";

export default function DeleteManyModal({
  isOpen,
  itemIds,
  list,
  onClose,
  onDelete,
}) {
  const [deleteItems, { loading }] = useMutation(list.deleteManyMutation, {
    refetchQueries: ["getList"],
  });

  return (
    <Confirm
      isOpen={isOpen}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !loading) {
          onClose();
        }
      }}
    >
      <p style={{ marginTop: 0 }}>
        Bạn chắc chắn muốn xóa <strong>{list.formatCount(itemIds)}</strong>?
      </p>
      <footer>
        <Button
          className="btn btn-danger"
          variant="ghost"
          onClick={async () => {
            if (loading) return;
            await deleteItems({ variables: { ids: itemIds } });
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

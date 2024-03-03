/** @jsx jsx */
import { jsx } from "@emotion/core";

import { IconButton } from "@arch-ui/button";
import { PlusIcon } from "@primer/octicons-react";

import { useList } from "../../providers/List";

const CreateItem = () => {
  const {
    list: { access },
    openCreateItemModal,
  } = useList();
  if (!access.create) return null;
  const cypressCreateId = "list-page-create-button";
  return (
    <IconButton
      className="btn btn-primary"
      icon={PlusIcon}
      onClick={openCreateItemModal}
      id={cypressCreateId}
    >
      Tạo mới
    </IconButton>
  );
};

export default CreateItem;

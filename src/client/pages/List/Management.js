/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Fragment } from "react";

import { FlexGroup } from "@arch-ui/layout";
import { colors, gridSize } from "@arch-ui/theme";

import { useUIHooks } from "../../providers/Hooks";
import DeleteItems from "../../components/DeleteItems";
import UpdateItems from "../../components/UpdateItems";

export const ManageToolbar = ({ isVisible, ...props }) => (
  <div
    style={{
      height: "35px",
      marginBottom: `${gridSize * 2}px`,
      marginTop: `${gridSize}px`,
      visibility: isVisible ? "visible" : "hidden",
    }}
    {...props}
  />
);

const SelectedCount = (props) => (
  <div style={{ color: colors.N40, marginRight: `${gridSize}px` }} {...props} />
);

const ListManage = ({ pageSize, totalItems, selectedItems }) => {
  const { listManageActions } = useUIHooks();

  return (
    <Fragment>
      <FlexGroup align="center">
        <SelectedCount>
          {`${selectedItems.length} của ${Math.min(
            pageSize,
            totalItems,
          )} được chọn`}
        </SelectedCount>
        {listManageActions ? (
          listManageActions()
        ) : (
          <Fragment>
            <UpdateItems />
            <DeleteItems />
          </Fragment>
        )}
      </FlexGroup>
    </Fragment>
  );
};

export default ListManage;

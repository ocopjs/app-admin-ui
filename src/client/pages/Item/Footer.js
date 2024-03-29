/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Fragment, useState, memo, useEffect } from "react";
import { Button, LoadingButton } from "@arch-ui/button";
import { colors, gridSize } from "@arch-ui/theme";
import { alpha } from "@arch-ui/color-utils";

import { useList } from "../../providers/List";

const Toolbar = (props) => (
  <div
    style={{
      backgroundColor: alpha("#fff", 0.93),
      bottom: 0,
      boxShadow: `${alpha(colors.text, 0.1)} 0px -2px 0px`,
      display: "flex",
      justifyContent: "space-between",
      paddingBottom: gridSize * 2,
      paddingTop: gridSize * 2,
      position: "sticky",
    }}
    {...props}
  />
);

function useKeyListener(listener, deps) {
  useEffect(() => {
    document.addEventListener("keydown", listener, false);
    return () => {
      document.removeEventListener("keydown", listener, false);
    };
  }, deps);
}

function Reset({ canReset, onReset }) {
  let [resetRequested, setResetRequested] = useState(false);

  useKeyListener(
    (event) => {
      if (!event.defaultPrevented && event.key === "Escape") {
        setResetRequested(false);
      }
    },
    [setResetRequested],
  );

  if (!canReset && resetRequested) {
    setResetRequested(false);
  }

  return resetRequested ? (
    <div
      style={{ display: "flex", alignItems: "center", marginLeft: gridSize }}
    >
      <div style={{ fontSize: "0.9rem", marginRight: gridSize }}>
        Bạn chắc chứ?
      </div>
      <Button
        className="btn btn-danger"
        autoFocus
        onClick={onReset}
        variant="ghost"
      >
        Hủy thảo tác
      </Button>
      <Button
        variant="subtle"
        onClick={() => {
          setResetRequested(false);
        }}
      >
        Thôi
      </Button>
    </div>
  ) : (
    <Button
      appearance="warning"
      isDisabled={!canReset}
      variant="subtle"
      onClick={() => {
        setResetRequested(true);
      }}
    >
      Hủy thao tác
    </Button>
  );
}

export default memo(
  ({
    onSave,
    onDelete,
    canReset,
    updateInProgress,
    onReset,
    hasWarnings,
    hasErrors,
  }) => {
    const { list } = useList();
    const cypressId = "item-page-save-button";

    return (
      <Fragment>
        <Toolbar key="footer">
          <div style={{ display: "flex", alignItems: "center" }}>
            <LoadingButton
              className={`btn btn-${
                hasWarnings && !hasErrors ? "warning" : "primary"
              }`}
              id={cypressId}
              isDisabled={updateInProgress || hasErrors || !list.access.update}
              isLoading={updateInProgress}
              onClick={onSave}
              style={{ marginRight: 8 }}
              type="submit"
            >
              {hasWarnings && !hasErrors
                ? "Bỏ qua cảnh báo và lưu thay đổi"
                : "Lưu thay đổi"}
            </LoadingButton>
            <Reset canReset={canReset} onReset={onReset} />
          </div>
          <div>
            <Button
              className="btn btn-danger"
              isDisabled={updateInProgress || !list.access.delete}
              variant="nuance"
              onClick={onDelete}
            >
              Xóa
            </Button>
          </div>
        </Toolbar>
      </Fragment>
    );
  },
);

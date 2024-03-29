/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef, Fragment } from "react";

import { Button } from "@arch-ui/button";
import PopoutModal from "@arch-ui/popout";
import { colors, gridSize } from "@arch-ui/theme";
import { alpha } from "@arch-ui/color-utils";

export const POPOUT_GUTTER = gridSize * 2;

// Layout
const Bar = (props) => (
  <div
    style={{
      paddingBottom: `${gridSize * 1.5}px`,
      paddingTop: `${gridSize * 1.5}px`,
      marginLeft: `${POPOUT_GUTTER}px`,
      marginRight: `${POPOUT_GUTTER}px`,
      position: "relative",
      zIndex: 1,
    }}
    {...props}
  />
);

const Header = (props) => (
  <Bar
    style={{
      alignItems: "center",
      boxShadow: `0 2px 0 ${alpha(colors.text, 0.1)}`,
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
    }}
    {...props}
  />
);

const HeaderTitle = (props) => (
  <div
    style={{
      fontWeight: "bold",
      fontSize: "0.85em",
    }}
    {...props}
  />
);

const HeaderLeft = (props) => (
  <div
    style={{
      position: "absolute",
      left: 0,
    }}
    {...props}
  />
);

const HeaderRight = (props) => (
  <div
    style={{
      position: "absolute",
      left: 0,
    }}
    {...props}
  />
);

const Body = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{
      maxHeight: "300px",
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScroll: "touch",
    }}
    {...props}
  />
));

const Footer = (props) => (
  <Bar
    style={{
      alignItems: "center",
      boxShadow: `0 -2px 0 ${alpha(colors.text, 0.1)}`,
      display: "flex",
      justifyContent: "space-between",
    }}
    {...props}
  />
);

// Other
export const DisclosureArrow = ({ size = "0.3em", ...props }) => (
  <span
    style={{
      borderLeft: `${size} solid transparent`,
      borderRight: `${size} solid transparent`,
      borderTop: `${size} solid`,
      display: "inline-block",
      height: 0,
      marginLeft: "0.33em",
      marginTop: "-0.125em",
      verticalAlign: "middle",
      width: 0,
    }}
    {...props}
  />
);

export const Popout = ({
  buttonLabel,
  component: Wrapper = Fragment,
  children,
  innerRef,
  bodyRef,
  footerContent,
  headerAfter,
  headerBefore,
  headerTitle,
  target,
  ...props
}) => {
  const defaultTarget = (handlers) => (
    <Button variant="subtle" appearance="primary" {...handlers}>
      {buttonLabel}
      <DisclosureArrow />
    </Button>
  );

  return (
    <PopoutModal ref={innerRef} target={target || defaultTarget} {...props}>
      <Wrapper>
        <Header>
          <HeaderLeft>{headerBefore}</HeaderLeft>
          <HeaderTitle>{headerTitle}</HeaderTitle>
          <HeaderRight>{headerAfter}</HeaderRight>
        </Header>
        <Body ref={bodyRef}>{children}</Body>
        {footerContent ? <Footer>{footerContent}</Footer> : null}
      </Wrapper>
    </PopoutModal>
  );
};

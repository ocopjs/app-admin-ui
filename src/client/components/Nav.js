/* global ENABLE_DEV_FEATURES */
/** @jsx jsx */

import React, { forwardRef, Fragment, useMemo, useState } from "react"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Link, useRouteMatch } from "react-router-dom";
// import PropToggle from 'react-prop-toggle';
import { uid } from "react-uid";
import { jsx } from "@emotion/core";

import { colors, gridSize } from "@arch-ui/theme";
import { alpha } from "@arch-ui/color-utils";
import {
  PRIMARY_NAV_GUTTER,
  PrimaryNav,
  PrimaryNavHeading,
  PrimaryNavItem,
  PrimaryNavScrollArea,
} from "@arch-ui/navbar";
import { Truncate } from "@arch-ui/typography";
import Tooltip from "@arch-ui/tooltip";
import { FlexGroup } from "@arch-ui/layout";
import {
  MarkGithubIcon,
  PersonIcon,
  SignOutIcon,
  TerminalIcon,
} from "@primer/octicons-react";

import { useAdminMeta } from "../providers/AdminMeta";
import { KEYBOARD_SHORTCUT, useResizeHandler } from "../hooks/ResizeHandler";
import { useScrollQuery } from "../hooks/ScrollQuery";

import { gql, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { UserInfo } from "./User/Info";

const TRANSITION_DURATION = "220ms";
const TRANSITION_EASING = "cubic-bezier(0.2, 0, 0, 1)";

function camelToKebab(string) {
  return string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

const Col = (props) => (
  <div
    style={{
      alignItems: "flex-start",
      display: "flex",
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
      overflow: "hidden",
      width: "100%",
    }}
    {...props}
  />
);

const Inner = (props) => (
  <Col style={{ height: "100vh", alignItems: "stretch" }} {...props} />
);

const Page = (props) => (
  <div
    style={{ flex: 1, minHeight: "100vh", position: "relative" }}
    {...props}
  />
);

const PageWrapper = (props) => <div style={{ display: "flex" }} {...props} />;

const Relative = (props) => (
  <Col style={{ height: "100%", position: "relative" }} {...props} />
);

const GrabHandle = ({ isActive, ...props }) => (
  <div
    style={{
      backgroundColor: alpha(colors.text, 0.06),
      height: isActive ? "100%" : 0,
      cursor: "col-resize",
      position: "absolute",
      right: 0,
      top: 0,
      transition: `background-color ${TRANSITION_DURATION} linear, height ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
      width: 1,

      ":hover": {
        transitionDelay: "100ms", // avoid inadvertent mouse passes
        backgroundColor: alpha(colors.text, 0.12),
      },
      ":active": {
        backgroundColor: alpha(colors.text, 0.24),
      },

      // increase hit-area
      ":before": {
        bottom: -gridSize,
        content: '" "',
        left: -gridSize,
        position: "absolute",
        right: -gridSize,
        top: -gridSize,
      },
    }}
    {...props}
  />
);

const CollapseExpand = forwardRef(
  ({ isCollapsed, mouseIsOverNav, ...props }, ref) => {
    const size = 32;
    const offsetTop = 20;
    const isActive = isCollapsed || mouseIsOverNav;

    return (
      <button
        ref={ref}
        style={{
          alignItems: "center",
          background: 0,
          border: 0,
          borderRadius: "50%",
          // boxShadow,
          color: isActive ? colors.text : "transparent",
          cursor: "pointer",
          display: "flex",
          height: size,
          justifyContent: "center",
          right: -size,
          transform: isActive ? `translateX(0)` : `translateX(-10px)`,
          outline: 0,
          padding: 0,
          position: "absolute",
          transition: `color ${TRANSITION_DURATION}, transform ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
          width: size,
          top: offsetTop,

          ":hover": {
            color: "var(--color-text-primary) !important",
          },
        }}
        {...props}
      />
    );
  },
);

const TooltipContent = ({ kbd, children }) => (
  <FlexGroup align="center" growIndexes={[0]}>
    <span key="children">{children}</span>
    <kbd
      key="kbd"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 2,
        display: "inline-block",
        fontWeight: "bold",
        height: 14,
        lineHeight: 1,
        paddingBottom: 1,
        paddingLeft: 4,
        paddingRight: 4,
      }}
    >
      {kbd}
    </kbd>
  </FlexGroup>
);

function getPath(str) {
  const arr = str.split("/");
  return `/${arr[1]}/${arr[2]}`;
}

function renderChildren(
  node,
  authListKey,
  mouseIsOverNav,
  getListByKey,
  adminPath,
  depth,
  onRenderIndexPage,
) {
  if (node.children) {
    const groupKey = uid(node.children);
    depth += 1;

    return (
      <React.Fragment key={groupKey}>
        {node.label && (
          <PrimaryNavHeading depth={depth}>{node.label}</PrimaryNavHeading>
        )}
        {node.children.map((child) =>
          renderChildren(
            child,
            authListKey,
            mouseIsOverNav,
            getListByKey,
            adminPath,
            depth,
            onRenderIndexPage,
          ),
        )}
      </React.Fragment>
    );
  }

  if (typeof node.path === "string") {
    if (node.path === "") {
      onRenderIndexPage();
    }
    const { path, label } = node;
    const href = `${adminPath}/${path}`;
    const isSelected = href === location.pathname;
    return (
      <PrimaryNavItem
        key={path}
        depth={depth}
        isSelected={isSelected}
        mouseIsOverNav={mouseIsOverNav}
        to={href}
      >
        {label}
      </PrimaryNavItem>
    );
  }

  const key = typeof node === "string" ? node : node.listKey;
  const list = getListByKey(key);

  if (!list) {
    throw new Error(`Unable to resolve list for key ${key}`);
  }

  const label = node.label || list.plural;
  const isSelected = list.fullPath === getPath(location.pathname);
  const id = `ks-nav-${list.path}`;

  return (
    <PrimaryNavItem
      key={key}
      depth={depth}
      id={id}
      isSelected={isSelected}
      to={list.getFullPersistentPath()}
      mouseIsOverNav={mouseIsOverNav}
    >
      {label}
      {key === authListKey ? (
        <PersonIcon
          title={label}
          color={colors.N20}
          style={{ paddingLeft: 8, paddingTop: 4 }}
        />
      ) : null}
    </PrimaryNavItem>
  );
}

function PrimaryNavItems({
  adminPath,
  authListKey,
  getListByKey,
  pages,
  listKeys,
  mouseIsOverNav,
}) {
  const isAtDashboard = useRouteMatch({ path: adminPath, exact: true });
  const [scrollRef, snapshot] = useScrollQuery({ isPassive: false });

  let hasRenderedIndexPage = false;
  const onRenderIndexPage = () => {
    hasRenderedIndexPage = true;
  };

  const pageNavItems =
    pages && pages.length
      ? pages
          .filter((node) => node.addToNav !== false)
          .map((node) =>
            renderChildren(
              node,
              authListKey,
              mouseIsOverNav,
              getListByKey,
              adminPath,
              0,
              onRenderIndexPage,
            ),
          )
      : listKeys.map((key) =>
          renderChildren(
            key,
            authListKey,
            mouseIsOverNav,
            getListByKey,
            adminPath,
            0,
            onRenderIndexPage,
          ),
        );
  return (
    <Relative>
      <PrimaryNavScrollArea ref={scrollRef} {...snapshot}>
        {hasRenderedIndexPage === false && (
          <PrimaryNavItem
            to={adminPath}
            isSelected={isAtDashboard}
            mouseIsOverNav={mouseIsOverNav}
          >
            Trang chủ
          </PrimaryNavItem>
        )}

        {pageNavItems}
      </PrimaryNavScrollArea>
    </Relative>
  );
}

const UserInfoContainer = (props) => (
  <div
    style={{
      paddingBottom: `${PRIMARY_NAV_GUTTER}px`,
      margin: `${PRIMARY_NAV_GUTTER}px`,
      borderBottom: `2px solid ${colors.N10}`,
      display: "flex",
      alignItems: "center",
      fontSize: "1.3em",
    }}
    {...props}
  />
);
const UserIcon = (props) => (
  <div
    style={{
      flexShrink: 0,
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: `${PRIMARY_NAV_GUTTER}px`,
    }}
    className="color-bg-primary"
    {...props}
  />
);

// const UserInfo = ({ authListPath }) => {
//   const meta = useAdminMeta();
//   const { authService } = meta;
//   const AUTHED_USER_QUERY = gql`
//     query {
//       user: edumsUser
//     }
//   `;
//   // FIXME: figure out how best to handle a case where the user changed their name from the Admin UI.
//   // Perhaps a subscription once those are implemented?
//   // const authClient = useMemo(() => initApolloClient({ uri: authUri }), []);
//   const { data: { user } = {}, loading } = useQuery(AUTHED_USER_QUERY, {
//     onCompleted: ({ user }) => {
//       if (!user && authService.redirect) {
//         window.location.replace(authService.redirect);
//       }
//     },
//   });
//
//   // Can't fetch user data for some reason. Don't show anything.
//   if (!loading && !user) {
//     return null;
//   }
//
//   return (
//     <Fragment>
//       <UserInfoContainer>
//         <UserIcon>
//           <PersonIcon size={24} />
//         </UserIcon>
//         <div style={{ overflow: "hidden" }}>
//           <Truncate style={{ fontSize: "0.7em" }}>Xin chào,</Truncate>
//           {loading ? (
//             "Loading..."
//           ) : (
//             <Truncate
//               as={Link}
//               to={`#`}
//               style={{ fontWeight: "bold", color: colors.N90 }}
//             >
//               {user.name}
//             </Truncate>
//           )}
//         </div>
//       </UserInfoContainer>
//       <div>
//         <PrimaryNavItem label="Đăng xuất" to={"/admin/signout"}>
//           <SignOutIcon style={{ flexShrink: 0 }} />
//           <span style={{ padding: `0 ${PRIMARY_NAV_GUTTER}px` }}>Đăng xuất</span>
//         </PrimaryNavItem>
//       </div>
//     </Fragment>
//   );
// };
//
const GITHUB_PROJECT = "https://github.com/";

const ActionItems = ({ mouseIsOverNav }) => {
  const { signoutPath, graphiqlPath, authStrategy } = useAdminMeta();

  const entries = useMemo(
    () => [
      {
        to: signoutPath,
        label: "Đăng xuất",
        icon: SignOutIcon,
      },
      ...(ENABLE_DEV_FEATURES
        ? [
            {
              to: graphiqlPath,
              label: "GraphQL Playground",
              icon: TerminalIcon,
              target: "_blank",
            },
            {
              label: "GitHub",
              to: GITHUB_PROJECT,
              icon: MarkGithubIcon,
              target: "_blank",
            },
          ]
        : []),
    ],
    [], // The admin meta never changes between server restarts
  );

  // No items to show
  if (!entries.length) {
    return null;
  }

  return (
    <div style={{ marginBottom: `${PRIMARY_NAV_GUTTER}px` }}>
      {entries.map(({ label, to, icon: ActionIcon, target }) => (
        <PrimaryNavItem
          key={to}
          {...(target === "_blank" ? { href: to } : { to })}
          target={target}
          mouseIsOverNav={mouseIsOverNav}
          style={{ display: "flex", alignItems: "center" }}
        >
          <ActionIcon style={{ flexShrink: 0 }} />
          <span style={{ padding: `0 ${PRIMARY_NAV_GUTTER}px` }}>{label}</span>
        </PrimaryNavItem>
      ))}
    </div>
  );
};

const PrimaryNavContent = ({ mouseIsOverNav }) => {
  const {
    adminPath,
    getListByKey,
    listKeys,
    pages,
    authStrategy: { listKey: authListKey } = {},
    authService,
  } = useAdminMeta();

  return (
    <Inner>
      {authListKey && (
        <UserInfo
          authListPath={getListByKey(authListKey).fullPath || "users"}
        />
      )}
      <ActionItems mouseIsOverNav={mouseIsOverNav} />
      <PrimaryNavItems
        adminPath={adminPath}
        authListKey={authListKey}
        getListByKey={getListByKey}
        listKeys={listKeys}
        pages={pages}
        mouseIsOverNav={mouseIsOverNav}
      />
    </Inner>
  );
};

const Nav = ({ children }) => {
  const [mouseIsOverNav, setMouseIsOverNav] = useState(false);

  const handleMouseEnter = () => {
    setMouseIsOverNav(true);
  };

  const handleMouseLeave = () => {
    setMouseIsOverNav(false);
  };

  const {
    resizeProps,
    clickProps,
    snapshot: { isCollapsed, isDragging, width },
  } = useResizeHandler();

  const navWidth = isCollapsed ? 0 : width;
  const makeResizeStyles = (key) => {
    const pointers = isDragging ? { pointerEvents: "none" } : null;
    const transitions = isDragging
      ? null
      : {
          transition: `${camelToKebab(
            key,
          )} ${TRANSITION_DURATION} ${TRANSITION_EASING}`,
        };
    return { [key]: navWidth, ...pointers, ...transitions };
  };

  return (
    <PageWrapper>
      {/* <PropToggle
        isActive={isDragging}
        styles={{
          cursor: 'col-resize',
          '-moz-user-select': 'none',
          '-ms-user-select': 'none',
          '-webkit-user-select': 'none',
          'user-select': 'none',
        }}
      /> */}
      <PrimaryNav
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={makeResizeStyles("width")}
      >
        <PrimaryNavContent mouseIsOverNav={mouseIsOverNav} />
        {isCollapsed ? null : (
          <GrabHandle
            onDoubleClick={clickProps.onClick}
            isActive={mouseIsOverNav || isDragging}
            {...resizeProps}
          />
        )}
        <Tooltip
          content={
            <TooltipContent kbd={KEYBOARD_SHORTCUT}>
              {isCollapsed ? "Click to Expand" : "Click to Collapse"}
            </TooltipContent>
          }
          placement="right"
          hideOnMouseDown
          hideOnKeyDown
          delay={600}
        >
          {(ref) => (
            <CollapseExpand
              isCollapsed={isCollapsed}
              mouseIsOverNav={mouseIsOverNav}
              {...clickProps}
              ref={ref}
            >
              <svg
                fill="currentColor"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 12h11a1 1 0 0 1 0 2H2a1 1 0 0 1 0-2zm0-5h9a1 1 0 0 1 0 2H2a1 1 0 1 1 0-2zm0-5h12a1 1 0 0 1 0 2H2a1 1 0 1 1 0-2z" />
              </svg>
            </CollapseExpand>
          )}
        </Tooltip>
      </PrimaryNav>
      <Page style={makeResizeStyles("marginLeft")}>{children}</Page>
    </PageWrapper>
  );
};

export default Nav;

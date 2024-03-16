import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useAdminMeta } from "../../providers/AdminMeta";
import { PersonIcon } from "@primer/octicons-react";
import { Truncate } from "@arch-ui/typography";
import { PRIMARY_NAV_GUTTER } from "@arch-ui/navbar";
import { Link } from "react-router-dom";
import { colors } from "@arch-ui/theme";

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
      backgroundColor: `${colors.primary}`,
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: `${PRIMARY_NAV_GUTTER}px`,
    }}
    {...props}
  />
);

export const UserInfo = ({ authListPath }) => {
  const {
    authStrategy: {
      gqlNames: { authenticatedQueryName },
    },
  } = useAdminMeta();

  const AUTHED_USER_QUERY = gql`
    query {
      user: ${authenticatedQueryName} {
        id
        _label_
      }
    }
  `;

  // FIXME: figure out how best to handle a case where the user changed their name from the Admin UI.
  // Perhaps a subscription once those are implemented?
  const { data: { user } = {}, loading } = useQuery(AUTHED_USER_QUERY);

  // Can't fetch user data for some reason. Don't show anything.
  if (!loading && !user) {
    return null;
  }

  return (
    <UserInfoContainer>
      <UserIcon>
        <PersonIcon size={24} />
      </UserIcon>
      <div style={{ overflow: "hidden" }}>
        <Truncate style={{ fontSize: "0.7em" }}>Logged in as</Truncate>
        {loading ? (
          "Loading..."
        ) : (
          <Truncate
            as={Link}
            to={`${authListPath}/${user.id}`}
            style={{ fontWeight: "bold", color: colors.N90 }}
          >
            {user._label_}
          </Truncate>
        )}
      </div>
    </UserInfoContainer>
  );
};

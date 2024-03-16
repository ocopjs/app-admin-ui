/** @jsx jsx */

import { jsx } from "@emotion/core";

import { Fragment, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { CheckIcon } from "@primer/octicons-react";
import { LoadingIndicator } from "@arch-ui/loading";
import Animation from "../components/Animation";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const FlexBox = (props) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
    {...props}
  />
);

const Container = (props) => (
  <FlexBox style={{ minHeight: "100vh" }} {...props} />
);

const Caption = (props) => <p style={{ fontSize: "1.5em" }} {...props} />;

const SetTokenPage = () => {
  const AUTHED_USER_QUERY = gql`
    query {
      user: edumsUser
    }
  `;
  const history = useHistory();
  let { search, state } = useLocation();

  const { data: { user } = {}, loading } = useQuery(AUTHED_USER_QUERY, {
    onError: (error) => {
      console.log(error);
    },
    onCompleted: (data) => {
      console.log(data);
      if (user) history.push("/admin");
      else window.location.replace(authService.redirect);
    },
  });
  useEffect(() => {
    const params = new URLSearchParams(search);
    const value = params.get("token");
    if (value) {
      localStorage.setItem("token", value);
      history.push("/admin/set-token");
    }
    // history.push(`/admin`);
  }, [search]);
  return (
    <Container>
      {loading ? (
        <Fragment>
          <LoadingIndicator style={{ height: "3em" }} size={12} />
          <Caption>Đăng xuất.</Caption>
        </Fragment>
      ) : (
        <Fragment>
          <Animation name="pulse" duration="500ms">
            <CheckIcon
              size={48}
              style={{ color: "var(--color-text-success) !important" }}
            />
          </Animation>
          <Caption>Hoàn thành đăng nhập.</Caption>
        </Fragment>
      )}
    </Container>
  );
};

export default SetTokenPage;

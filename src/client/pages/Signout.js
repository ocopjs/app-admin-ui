/** @jsx jsx */

import { jsx } from "@emotion/core";

import { Fragment, useEffect, useMemo } from "react";

import { gql, useApolloClient, useMutation } from "@apollo/client";

import { CheckIcon } from "@primer/octicons-react";
import { Button } from "@arch-ui/button";
import { LoadingIndicator } from "@arch-ui/loading";
import Animation from "../components/Animation";
import { useAdminMeta } from "../providers/AdminMeta";
import { initApolloClient } from "../apolloClient";

const FlexBox = (props) => (
  <div
    css={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
    {...props}
  />
);

const Container = (props) => (
  <FlexBox css={{ minHeight: "100vh" }} {...props} />
);

const Caption = (props) => <p css={{ fontSize: "1.5em" }} {...props} />;

const SignOutPageButton = (props) => (
  <Button
    css={{
      width: "200px",
      height: "2.6em",
      marginBottom: "0.8em",
      lineHeight: "unset",
    }}
    {...props}
  />
);

const SignedOutPage = () => {
  const { authService = {}, signinPath } = useAdminMeta();
  console.log(authService);
  const { gqlNames = {}, uri: authUri } = authService;
  const { unauthenticateMutationName = "unauthenticateUser" } = gqlNames;
  const UNAUTH_MUTATION = gql`
    mutation {
      unauthenticate: ${unauthenticateMutationName} {
        success
      }
    }
  `;

  const authClient = useMemo(() => initApolloClient({ uri: authUri }), []);
  const client = useApolloClient();
  // const [signOut, { loading, client, called }] = useMutation(UNAUTH_MUTATION, {
  //   client: authClient,
  //   onCompleted: async () => {
  //     // Ensure there's no old authenticated data hanging around
  //     localStorage.removeItem("token");
  //     await client.clearStore();
  //   },
  // });

  async function signOut() {
    localStorage.removeItem("token");
    await client.clearStore();
  }

  useEffect(() => {
    signOut();
  }, []);

  // if (!called) {
  //   signOut();
  // }
  const loading = false;
  return (
    <Container>
      {loading ? (
        <Fragment>
          <LoadingIndicator css={{ height: "3em" }} size={12} />
          <Caption>Đăng xuất.</Caption>
        </Fragment>
      ) : (
        <Fragment>
          <Animation name="pulse" duration="500ms">
            <CheckIcon
              size={48}
              css={{ color: "var(--color-text-success) !important" }}
            />
          </Animation>
          <Caption>Bạn đã đăng xuất.</Caption>
          <FlexBox>
            <SignOutPageButton
              variant="ghost"
              href={authService?.redirect || signinPath}
            >
              Đăng nhập
            </SignOutPageButton>
          </FlexBox>
        </Fragment>
      )}
    </Container>
  );
};

export default SignedOutPage;

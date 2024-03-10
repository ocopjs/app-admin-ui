/** @jsx jsx */

import { useMemo, useState } from "react";
import { jsx } from "@emotion/core";

import { Alert } from "@arch-ui/alert";
import { LoadingButton } from "@arch-ui/button";
import { Input } from "@arch-ui/input";
import { colors, gridSize } from "@arch-ui/theme";
import { PageTitle, Title } from "@arch-ui/typography";

import { gql, useMutation, useQuery } from "@apollo/client";

import { upcase } from "@ocopjs/utils";

import { useAdminMeta } from "../providers/AdminMeta";
import { useUIHooks } from "../providers/Hooks";
import { initApolloClient } from "../apolloClient";
const _PADDING = gridSize * 2;
const _BUTTON_WIDTH = 280;

const Container = (props) => (
  <div
    css={{
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      minHeight: "100vh",
      width: "100%",
    }}
    {...props}
  />
);

const Alerts = (props) => <div css={{ height: "48px" }} {...props} />;

const Form = (props) => (
  <form
    css={{
      marginBottom: "120px",
      minWidth: "650px",
      padding: "40px",
      display: "flex",
      flexWrap: "nowrap",
      justifyContent: "center",
      alignItems: "center",
    }}
    {...props}
  />
);

const Divider = (props) => (
  <div
    css={{
      borderRight: `2px solid ${colors.N10}`,
      minHeight: "450px",
      lineHeight: "450px",
      marginRight: "40px",
      marginLeft: "60px",
    }}
    {...props}
  />
);

const FieldLabel = (props) => (
  <div
    css={{
      color: `${colors.N60}`,
      marginTop: `${_PADDING}px`,
      marginBottom: `${gridSize}px`,
      fontSize: `${_PADDING}px`,
    }}
    {...props}
  />
);

const Fields = (props) => (
  <div
    css={{ margin: `${_PADDING}px 0`, width: `${_BUTTON_WIDTH}px` }}
    {...props}
  />
);

export const AUTH_MUTATION = ({
  authenticateMutationName,
  identityField,
  secretField,
}) =>
  gql`
mutation signin($identity: String, $secret: String) {
  authenticate: ${authenticateMutationName}(${identityField}: $identity, ${secretField}: $secret) {
    item {
      id
    }
    token
  }
}
`;
const SignInPage = () => {
  const authenticateMutationName = "";
  const identityField = "";
  const secretField = "";
  const {
    name: siteName,
    authService: {
      //   gqlNames: { authenticateMutationName, authenticatedQueryName },
      //   identityField,
      //   secretField,
      //   uri: authUri,
    },
  } = useAdminMeta();

  const AUTHED_USER_QUERY = gql`
    query {
      user: edumsUser
    }
  `;

  // const authClient = useMemo(() => initApolloClient({ uri: authUri }), []);
  const { logo: getCustomLogo } = useUIHooks();

  const [identity, setIdentity] = useState("");
  const [secret, setSecret] = useState("");

  const { refetch } = useQuery(AUTHED_USER_QUERY, {
    // client: authClient,
    onCompleted: (data) => {
      const { user } = data;
      if (user) window.location.href = "/admin";
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const [signIn, { error, loading }] = useMutation(
    AUTH_MUTATION({ authenticateMutationName, identityField, secretField }),
    {
      variables: { identity, secret },
      client: authClient,
      onCompleted: async ({ authenticate = {} }) => {
        const { token } = authenticate;
        if (token) {
          localStorage.setItem("token", token);
          await authClient.clearStore();
          await refetch();
        }
      },
      onError: () => {
        localStorage.removeItem("token");
      }, // Remove once a bad password no longer throws an error
    },
  );

  const onSubmit = (e) => {
    e.preventDefault();

    if (!loading) {
      signIn();
    }
  };

  return (
    <Container>
      <Alerts>
        {error && (
          <Alert appearance="danger">
            Tên đăng nhập hoặc mật khẩu không đúng
          </Alert>
        )}
      </Alerts>
      <Form method="post" onSubmit={onSubmit}>
        {/* {getCustomLogo ? getCustomLogo() : <Logo />} */}
        {/* <Divider /> */}
        <div>
          <PageTitle css={{ marginTop: 0, marginBottom: `${gridSize}px` }}>
            {siteName}
          </PageTitle>
          <Title css={{ marginBottom: `${_PADDING * 2}px` }}>
            Trang quản trị website
          </Title>
          <Fields>
            <FieldLabel>{upcase(identityField)}</FieldLabel>
            <Input
              name="identity"
              autoComplete="username"
              autoFocus
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
            />
            <FieldLabel>{upcase(secretField)}</FieldLabel>
            <Input
              type="password"
              name="secret"
              autoComplete="current-password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
          </Fields>
          <LoadingButton
            className="btn btn-primary"
            type="submit"
            isLoading={loading}
            indicatorVariant="dots"
            css={{
              width: `${_BUTTON_WIDTH}px`,
              height: "2.6em",
              margin: `${_PADDING}px 0`,
            }}
          >
            Đăng nhập
          </LoadingButton>
        </div>
      </Form>
    </Container>
  );
};

export default SignInPage;

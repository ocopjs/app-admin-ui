import React, { Suspense, useMemo } from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { Global } from "@emotion/core";

import { globalStyles } from "@arch-ui/theme";

import { initApolloClient } from "./apolloClient";

import { AdminMetaProvider, useAdminMeta } from "./providers/AdminMeta";
import { HooksProvider } from "./providers/Hooks";

import InvalidRoutePage from "./pages/InvalidRoute";
import SignoutPage from "./pages/Signout";
import SigninPage from "./pages/Signin";
import SignupPage from "./pages/Signup";
import { CustomChat, FacebookProvider } from "react-facebook";

/*
  NOTE:
  Using this page without an authStrategy of type PasswordAuthStrategy defined
  for the Admin UI would cause serious problems. It should also be impossible to
  actually do that, so we don't guard against it (yet).
*/
function FB({ children, appId, pageId }) {
  console.log(appId, pageId);
  return appId && pageId ? (
    <FacebookProvider appId={appId} chatSupport>
      <CustomChat pageId={pageId} minimized={false} />
      {children}
    </FacebookProvider>
  ) : (
    children
  );
}
const AdminMain = () => {
  const { appId, pageId, authStrategy, apiPath, signoutPath, hooks } =
    useAdminMeta();

  const apolloClient = useMemo(
    () => initApolloClient({ uri: apiPath }),
    [apiPath],
  );

  return (
    <HooksProvider hooks={hooks}>
      <ApolloProvider client={apolloClient}>
        <FB appId={appId} pageId={pageId}>
          <ToastProvider>
            <Global styles={globalStyles} />
            {authStrategy ? (
              <BrowserRouter>
                <Switch>
                  <Route exact path={signoutPath} children={<SignoutPage />} />
                  <Route
                    exact
                    path={"/admin/signup"}
                    children={<SignupPage />}
                  />
                  <Route children={<SigninPage />} />
                </Switch>
              </BrowserRouter>
            ) : (
              <InvalidRoutePage />
            )}
          </ToastProvider>
        </FB>
      </ApolloProvider>
    </HooksProvider>
  );
};

ReactDOM.render(
  <Suspense fallback={null}>
    <AdminMetaProvider>
      <AdminMain />
    </AdminMetaProvider>
  </Suspense>,
  document.getElementById("app"),
);

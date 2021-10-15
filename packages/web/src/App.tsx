import React from "react";
import { ChakraProvider, Box, Text, Link, VStack, Code, Grid, theme } from "@chakra-ui/react";
import { Switch, BrowserRouter, Route } from "react-router-dom";
import kratos from "./helpers/kratos";

import FullContainer from "./containers/Full";
import withoutAuthentication from "./containers/withoutAuthentication";

import LoginRoute from "./routes/Login";
import HomeRoute from "./routes/Home";
import RegisterRoute from "./routes/Register";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <FullContainer>
                <HomeRoute />
              </FullContainer>
            </Route>
            <Route
              exact
              path="/login"
              component={withoutAuthentication(LoginRoute, { redirectTo: "/" })}
            />
            <Route exact path="/register" component={RegisterRoute} />
          </Switch>
        </BrowserRouter>
      </Box>
    </ChakraProvider>
  );
};

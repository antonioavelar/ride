import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from "@chakra-ui/react"
import { Switch, BrowserRouter, Route } from "react-router-dom"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import LoginRoute from "./routes/Login"

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <ColorModeSwitcher justifySelf="flex-end" />
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <LoginRoute />
          </Route>
        </Switch>
      </BrowserRouter>
    </Box>
  </ChakraProvider>
)

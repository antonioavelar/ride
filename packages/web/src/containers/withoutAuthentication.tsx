import React, { useEffect, useState } from "react";
import { Flex, SkeletonText, SkeletonCircle, Box } from "@chakra-ui/react";
import kratos from "../helpers/kratos";

const LoadingSkeleton = () => {
  return (
    <>
      <Box
        padding="6"
        boxShadow="lg"
        bg="white"
        width="20%"
        height="full"
        pos="fixed"
        w={{ base: "full", md: 80 }}
      >
        <SkeletonText mt="4" noOfLines={4} spacing="4" paddingTop="4" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" paddingTop="4" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" paddingTop="4" />
      </Box>
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height="79px"
        alignItems="center"
        borderBottomWidth="1px"
        justifyContent={{ base: "space-between", md: "flex-end" }}
      >
        <SkeletonCircle size="10"></SkeletonCircle>
      </Flex>
    </>
  );
};

const withAuthenticationRequired = (Component, options) => {
  return function WithAuthenticationRequired(props): JSX.Element {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      (async () => {
        setIsLoading(true);
        try {
          await kratos.toSession();
          setIsAuthenticated(true);
        } catch (error) {
          setIsAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
      })();
    }, []);

    useEffect(() => {
      if (isLoading) {
        return;
      }

      if (isAuthenticated) {
        props.history.replace(options.redirectTo);
      }
    }, [isLoading, isAuthenticated]);

    return isLoading || isAuthenticated ? <LoadingSkeleton {...props} /> : <Component {...props} />;
  };
};

export default withAuthenticationRequired;

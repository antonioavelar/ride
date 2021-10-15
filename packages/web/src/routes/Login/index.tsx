import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Configuration,
  V0alpha1Api,
  SubmitSelfServiceLoginFlowWithPasswordMethodBodyMethodEnum as MethodsEnum,
} from "@ory/kratos-client";
import { useEffect, useState } from "react";

// Uses the ORY Kratos NodeJS SDK:
const kratos = new V0alpha1Api(
  new Configuration({ basePath: process.env.REACT_APP_KRATOS_PUBLIC }),
);

export default function Login(props: any) {
  const [values, setValues] = useState({
    password_identifier: "",
    password: "",
  });
  const [form, setForm] = useState({} as any);

  const login = async () => {
    await kratos.submitSelfServiceLoginFlow(
      form.id,
      {
        ...values,
        csrf_token: form.ui.nodes[0].attributes.value,
        method: MethodsEnum.Password,
      },
      { withCredentials: true },
    );

    // redirect to user home page
    props.history.replace("/");
  };

  useEffect(() => {
    console.log("MOUNTED!");
    (async () => {
      await kratos
        .initializeSelfServiceLoginFlowForBrowsers(false)
        .then((res) => {
          setForm(res.data);
        })
        .catch((err) => {});
    })();
  }, []);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
          </Text>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                value={values.password_identifier}
                onChange={(e) => setValues({ ...values, password_identifier: e.target.value })}
                type="email"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                value={values.password}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                type="password"
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Link color={"blue.400"}>Forgot password?</Link>
              </Stack>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={login}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

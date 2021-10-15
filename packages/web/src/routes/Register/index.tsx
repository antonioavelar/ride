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
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  Configuration,
  V0alpha1Api,
  SubmitSelfServiceRegistrationFlowWithPasswordMethodBodyMethodEnum as MethodsEnum,
} from "@ory/kratos-client";
import { useEffect, useState } from "react";

// Uses the ORY Kratos NodeJS SDK:
const kratos = new V0alpha1Api(
  new Configuration({ basePath: process.env.REACT_APP_KRATOS_PUBLIC }),
);

export default function Create(props: any) {
  const [values, setValues] = useState({
    email: { value: "", error: null },
    first: { value: "", error: null },
    last: { value: "", error: null },
    password: { value: "", error: null },
    repeatPassword: { value: "", error: null },
  });
  const [form, setForm] = useState({} as any);

  const createAccount = async () => {
    try {
      const { data } = await kratos.submitSelfServiceRegistrationFlow(form.id, {
        method: MethodsEnum.Password,
        csrf_token: form.ui.nodes[0].attributes.value,
        password: values.password.value,
        traits: {
          email: values.email.value,
          name: {
            first: values.first.value,
            last: values.last.value,
          },
        },
      });
    } catch (error) {
      setForm(error.response.data);
    }
  };

  useEffect(() => {
    form?.ui?.nodes.forEach((node: any) => {
      switch (node.attributes.name) {
        case "traits.email":
          setValues((prev) => ({
            ...prev,
            email: { ...values.email, error: node.messages[0]?.text },
          }));
          break;
        case "password":
          setValues((prev) => ({
            ...prev,
            password: { ...values.password, error: node.messages[0]?.text },
          }));
          break;
        case "traits.name.fist":
          setValues((prev) => ({
            ...prev,
            first: { ...prev.first, error: node.messages[0]?.text },
          }));
          break;
        case "traits.name.last":
          setValues((prev) => ({
            ...prev,
            last: { ...prev.last, error: node.messages[0]?.text },
          }));
          break;
        default:
          break;
      }
    });
  }, [form]);

  useEffect(() => {
    (async () => {
      const { data } = await kratos.initializeSelfServiceRegistrationFlowForBrowsers(false);
      setForm(data);
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
          <Heading fontSize={"4xl"}>Create your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
          </Text>
        </Stack>
        <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <FormControl id="email" isInvalid={!!values.email.error}>
              <FormLabel>Email address</FormLabel>
              <Input
                value={values.email.value}
                onChange={(e) =>
                  setValues({ ...values, email: { ...values.email, value: e.target.value } })
                }
                type="email"
              />
              <FormErrorMessage>{values.email.error}</FormErrorMessage>
            </FormControl>
            <FormControl id="password" isInvalid={!!values.password.error}>
              <FormLabel>Password</FormLabel>
              <Input
                value={values.password.value}
                onChange={(e) =>
                  setValues({ ...values, password: { ...values.password, value: e.target.value } })
                }
                type="password"
              />
              <FormErrorMessage>{values.password.error}</FormErrorMessage>
            </FormControl>
            <FormControl id="password">
              <FormLabel>Repeat password</FormLabel>
              <Input
                value={values.repeatPassword.value}
                onChange={(e) =>
                  setValues({
                    ...values,
                    repeatPassword: { ...values.repeatPassword, value: e.target.value },
                  })
                }
                type="password"
              />
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={createAccount}
              >
                Create
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

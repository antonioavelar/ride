import React, { ReactElement, useEffect, useState } from "react";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Stack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  Button,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Divider,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher";
import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";
import { LocationSearch } from "../components/LocationSearch";
import { V0alpha1Api, Configuration } from "@ory/kratos-client";
import Coordinates from "../ts/types/Coordinates";

interface LinkItemProps {
  name: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [];
// Uses the ORY Kratos NodeJS SDK:
const kratos = new V0alpha1Api(
  new Configuration({ basePath: process.env.REACT_APP_KRATOS_PUBLIC }),
);

export default function SidebarWithHeader({ children }: { children: ReactElement }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [originLocation, setOriginLocation] = useState({ latitude: null, longitude: null });
  const [destinationLocation, setDestinationLocation] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    (async () => {
      try {
        await kratos.toSession();
      } catch (error) {
        window.location.replace("/login");
      }
    })();
  });

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        setOriginLocation={setOriginLocation}
        originLocation={originLocation}
        destinationLocation={destinationLocation}
        setDestinationLocation={setDestinationLocation}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent
            onClose={onClose}
            originLocation={originLocation}
            destinationLocation={destinationLocation}
            setOriginLocation={setOriginLocation}
            setDestinationLocation={setDestinationLocation}
          />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box height="calc(100vh - 79px)" ml={{ base: 0, md: 80 }}>
        {React.cloneElement(children, { origin: originLocation, destination: destinationLocation })}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  setOriginLocation: any;
  originLocation: Coordinates;
  destinationLocation: Coordinates;
  setDestinationLocation: any;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  console.log(rest);
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 80 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      <Box p="2" mx="4">
        <LocationSearch title="Origin" onLocationChange={rest.setOriginLocation} />
      </Box>
      <Box p="2" mx="4">
        <Divider />
      </Box>

      <Box p="2" mx="4">
        <LocationSearch title="Destination" onLocationChange={rest.setDestinationLocation} />
      </Box>

      <Box p="2" mx="4">
        <Stack direction="column" spacing={4}>
          <Button isLoading={false} colorScheme="teal" variant="solid">
            Find Rides
          </Button>
          <Button isLoading={false} loadingText="Submitting" colorScheme="teal" variant="outline">
            Share your ride
          </Button>
        </Stack>
      </Box>

      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link href="#" style={{ textDecoration: "none", boxShadow: "none" }}>
      <Flex
        align="center"
        p="2"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "green.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        <Text fontSize="medium">{children}</Text>
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const [traits, setTraits] = useState({
    email: "",
    name: {
      first: "",
      last: "",
    },
  });

  const getDisplayName = () => {
    return traits.name?.first ? `${traits.name.first} ${traits.name.last}` : traits.email;
  };

  useEffect(() => {
    (async () => {
      const { data } = await kratos.toSession();
      setTraits(data.identity.traits);
    })();
  }, []);

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="79px"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
              <HStack>
                <Avatar size={"sm"} name={getDisplayName()} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{getDisplayName()}</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

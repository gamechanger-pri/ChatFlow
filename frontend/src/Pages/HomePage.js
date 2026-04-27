import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from "@chakra-ui/react";
import Login from "../Components/Login";
import Signup from "../Components/Signup";
import { useHistory } from "react-router-dom";

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      history.push(`/chats`);
    }
  }, [history]);

  return (
    <Container maxW={"xl"} centerContent>
      <Box
        d="flex"
        justifyContent="center"
        alignItems={"center"}
        p={2}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text align={"center"} fontSize="2xl">
          Chatverse
        </Text>
      </Box>
      <Box bg="white" w="100%" p={3} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;

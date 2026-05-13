import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
  Badge,
} from "@chakra-ui/react";

import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";

import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";

// ✅ IMPORTANT: must be set in Vercel
// https://chatflow-mnrs.onrender.com/api
const API_BASE = process.env.REACT_APP_API_URL;

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const toast = useToast();
  const history = useHistory();

  // ---------------- LOGOUT ----------------
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  // ---------------- SEARCH USERS ----------------
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something",
        status: "warning",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_BASE}/user?search=${encodeURIComponent(search)}`,
        config
      );

      setSearchResult(data);
      setLoading(false);

    } catch (error) {
      setLoading(false);

      toast({
        title: "Error Occurred!",
        description: "Failed to load search results",
        status: "error",
      });
    }
  };

  // ---------------- ACCESS CHAT ----------------
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${API_BASE}/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);

    } catch (error) {
      setLoadingChat(false);

      toast({
        title: "Error fetching chat",
        description: error?.message || "Something went wrong",
        status: "error",
      });
    }
  };

  const cnt = notification.length;

  // ---------------- UI ----------------
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="1px"
      >
        {/* SEARCH BUTTON */}
        <Tooltip label="Search Users" hasArrow>
          <Button variant="ghost" onClick={() => {}}>
            <i className="fa fa-search" />
            <Text
              display={{ base: "none", md: "flex" }}
              px={4}
              fontFamily="Poppins"
            >
              Search User
            </Text>
          </Button>
        </Tooltip>

        {/* APP NAME */}
        <Text fontSize="2xl" fontFamily="Poppins">
          {process.env.REACT_APP_CHATBOT_NAME || "Chatverse"}
        </Text>

        {/* RIGHT MENU */}
        <Box display="flex" alignItems="center">

          {/* NOTIFICATIONS */}
          <Menu>
            <MenuButton p={1} bg={cnt === 0 ? "green.100" : "red.100"}>
              <BellIcon fontSize="2xl" />
              <Badge colorScheme={cnt === 0 ? "green" : "red"}>
                {cnt}
              </Badge>
            </MenuButton>

            <MenuList>
              {!notification.length && "No new messages"}

              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(
                      notification.filter((n) => n._id !== notif._id)
                    );
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* USER MENU */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} p={1}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.name}
                src={user?.pic}
              />
            </MenuButton>

            <MenuList fontFamily="Poppins">
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>

              <MenuDivider />

              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      {/* DRAWER */}
      <Drawer placement="left" onClose={() => {}} isOpen={false}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" fontFamily="Poppins">
            Search Users
          </DrawerHeader>

          <DrawerBody>

            {/* SEARCH INPUT */}
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {/* RESULTS */}
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((u) => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => accessChat(u._id)}
                />
              ))
            )}

            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;

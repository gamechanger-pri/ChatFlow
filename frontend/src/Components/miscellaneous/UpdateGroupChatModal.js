import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";

import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

// IMPORTANT: must be set in Vercel env
const API_BASE = process.env.REACT_APP_API_URL;

const UpdateGroupChatModal = ({
  fetchMessages,
  fetchAgain,
  setFetchAgain,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  // ---------------- SEARCH USER ----------------
  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) return;

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_BASE}/user?search=${encodeURIComponent(query)}`,
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

  // ---------------- RENAME GROUP ----------------
  const handleRename = async () => {
    if (!groupChatName.trim()) return;

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_BASE}/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName("");

    } catch (error) {
      setRenameLoading(false);

      toast({
        title: "Error Occurred!",
        description: error?.response?.data?.message || error.message,
        status: "error",
      });
    }
  };

  // ---------------- ADD USER ----------------
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User already in group",
        status: "warning",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add users",
        status: "error",
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

      const { data } = await axios.put(
        `${API_BASE}/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);

    } catch (error) {
      setLoading(false);

      toast({
        title: "Error Occurred!",
        description: error?.response?.data?.message || error.message,
        status: "error",
      });
    }
  };

  // ---------------- REMOVE USER / LEAVE ----------------
  const handleRemove = async (user1) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      user1._id !== user._id
    ) {
      toast({
        title: "Only admins can remove users",
        status: "error",
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

      const { data } = await axios.put(
        `${API_BASE}/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      if (user1._id === user._id) {
        setSelectedChat(null);
      } else {
        setSelectedChat(data);
      }

      setFetchAgain(!fetchAgain);
      fetchMessages?.();
      setLoading(false);

    } catch (error) {
      setLoading(false);

      toast({
        title: "Error Occurred!",
        description: error?.response?.data?.message || error.message,
        status: "error",
      });
    }
  };

  // ---------------- UI ----------------
  return (
    <>
      <IconButton icon={<ViewIcon />} onClick={onOpen} />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>

          <ModalHeader textAlign="center">
            {selectedChat?.chatName}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>

            {/* USERS */}
            <Box display="flex" flexWrap="wrap" mb={3}>
              {selectedChat?.users?.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>

            {/* RENAME */}
            <FormControl display="flex" mb={3}>
              <Input
                placeholder="New group name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />

              <Button
                ml={2}
                colorScheme="teal"
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            {/* SEARCH */}
            <Input
              placeholder="Add users..."
              onChange={(e) => handleSearch(e.target.value)}
            />

            {/* RESULTS */}
            {loading ? (
              <Spinner mt={3} />
            ) : (
              searchResult?.map((u) => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleAddUser(u)}
                />
              ))
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;

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
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Trigger */}
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
          aria-label="View Profile"
        />
      )}

      {/* Modal */}
      <Modal
        size="lg"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user?.name || "User"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            gap={4}
          >
            {/* Profile Image */}
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user?.pic || "https://via.placeholder.com/150"}
              alt={user?.name || "Profile"}
            />

            {/* Email */}
            <Text
              fontSize={{ base: "20px", md: "24px" }}
              fontFamily="Work sans"
            >
              Email: {user?.email || "Not available"}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} colorScheme="blue">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;

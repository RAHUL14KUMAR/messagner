import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
  } from "@chakra-ui/modal";
  import { Button,Heading, ModalOverlay } from "@chakra-ui/react";
  import { Form, Formik } from "formik";
  import TextField from "../TextField";
  import * as Yup from "yup";
  import { FriendContext } from "./Home";
  import { useCallback, useContext, useState } from "react";
  import { useStateValue } from "../../stateProvider";

  const AddFriendModal = ({ isOpen, onClose }) => {
    const [{user,socket},dispatch]=useStateValue();

    const [error, setError] = useState("");
    const closeModal = useCallback(() => {
      setError("");
      onClose();
    }, [onClose]);

    const { setFriendList } = useContext(FriendContext);

    return (
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a friend!</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{ friendName: "" }}
            onSubmit={values => {
              socket.connect()
              socket.emit(
                "add_friend",
                values.friendName,
                ({ errorMsg, done, newFriend }) => {
                  if (done) {
                    setFriendList(c => [newFriend, ...c]);
                    closeModal();
                    return;
                  }
                  setError(errorMsg);
                }
              );
            }}
            validationSchema={Yup.object({
                friendName: Yup.string()
                  .required("Username required")
                  .min(2, "Invalid username!")
                  .max(28, "Invalid username!"),
              })
            }
          >
            <Form>
              <ModalBody>
                <Heading fontSize="xl" color="red.500" textAlign="center">
                  {error}
                </Heading>
                <TextField
                  label="Friend's name"
                  placeholder="Enter friend's username.."
                  autoComplete="off"
                  name="friendName"
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" type="submit">
                  Submit
                </Button>
              </ModalFooter>
            </Form>
          </Formik>
        </ModalContent>
      </Modal>
    );
  };
  
  export default AddFriendModal;
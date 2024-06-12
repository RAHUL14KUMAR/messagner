import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, ButtonGroup, Heading, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import TextField from "./TextField";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{ username: "", password:"" }}
      validationSchema={Yup.object({
        username: Yup.string()
          .required("Username required!")
          .min(6, "Username too short!")
          .max(28, "Username too long!"),
        password: Yup.string()
      .required("Password required!")
          .min(6, "Password too short!")
          .max(28, "Password too long!"),
      })}
      onSubmit={async (values, actions) => {
        const vals = { ...values };
        const res=await axios.post("http://localhost:4000/auth/signup", {vals})
        if(res){
          console.log("data we receive",res.data)
          alert(res.data);
          navigate("/login");
        }else{
          console.log("error",res)
        }
      }}
    >
      <VStack
        as={Form}
        w={{ base: "90%", md: "500px" }}
        m="auto"
        justify="center"
        h="100vh"
        spacing="1rem"
      >
        <Heading>Sign Up</Heading>
        <TextField
          name="username"
          placeholder="Enter username"
          autoComplete="off"
          label="Username"
        />

        <TextField
          name="password"
          placeholder="Enter password"
          autoComplete="off"
          label="Password"
        />

        <ButtonGroup pt="1rem">
          <Button colorScheme="teal" type="submit">
            Create Account
          </Button>
          <Button onClick={() => navigate("/")} leftIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default SignUp;

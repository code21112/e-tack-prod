import { Form, Input, Button } from "antd";
import React, { useState } from "react";
// import { auth } from "../../firebase";
// import { toast } from "react-toastify";
import { MailOutlined } from "@ant-design/icons";

const Login2 = () => {
  const [email, setEmail] = useState("");
  const [correctEmail, setCorrectEmail] = useState(false);
  const [password, setPassword] = useState("");

  const checkingEmail = (e) => {
    const regex = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    setEmail(e);
    if (regex.test(e)) {
      setCorrectEmail(true);
      setEmail(e);
    } else {
      setCorrectEmail(false);
    }
  };

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const validateMessages = {
    // required: "${label} is required!",
    min: "Your password is at least 6 characters long.",
    types: {
      email: "This is not a valid email!",
      password: "Your password is at least 6 characters long.",
      //   number: "${label} is not a valid number!",
    },
    len: "Your password is at least 6 characters long.",
  };

  const onFinish = (values) => {
    console.log("values", values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
    //   setCorrectEmail(true);
    // }
    console.table(email, password);
  };

  // const checkingEmail = (e) => {
  //   console.log("alerts", alerts);
  //   console.log("alerts.length", alerts.length);
  //   if (alerts.length >= 1) {
  //     setCorrectEmail(false);
  //   } else {
  //     setCorrectEmail(true);
  //   }
  // };

  const loginForm = () => (
    <Form
      //   {...layout}
      name="nest-messages"
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      <Form.Item
        name={["user", "email"]}
        // label="Email"
        rules={[
          {
            type: "email",
          },
        ]}
      >
        <Input
          placeholder="Email"
          value={email}
          className="border-0 login_input"
          // onChange={(e) => setEmail(e.target.value)}
          onChange={(e) => checkingEmail(e.target.value)}
        />
      </Form.Item>
      <Form.Item
        name={"Your password"}
        // label="Password"
        rules={[
          {
            min: 6,
            // len: 6,
          },
        ]}
      >
        <Input
          // prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          className="border-0 login_input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Item>
      {/* <Form.Item
    name="password"
    rules={[
      {
        required: true,
        message: "Please input your Password!",
      },
    ]}
  >
    <Input
      prefix={<LockOutlined className="site-form-item-icon" />}
      type="password"
      placeholder="Password"
    />
  </Form.Item> */}
      {/* <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}> */}
      <Button
        onClick={handleSubmit}
        type="primary"
        shape="round"
        icon={<MailOutlined />}
        size="large"
        className="mb-3"
        block
        disabled={!correctEmail || password.length < 6}
      >
        Login with Email/Password
      </Button>
      {/* </Form.Item> */}
    </Form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Login</h4>
          {loginForm()}
        </div>
      </div>
    </div>
  );
};

export default Login2;

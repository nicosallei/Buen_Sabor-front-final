import { useAuth0 } from "@auth0/auth0-react";
import { LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      type="default"
      danger
      className="mx-2 my-2"
      size="small"
      onClick={() => logout({})}
    >
      <LogoutOutlined />
      Logout
    </Button>
  );
};

export default LogoutButton;

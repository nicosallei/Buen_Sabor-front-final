import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Rol, Usuario } from "../../../types/usuario/Usuario";
import * as CryptoJS from "crypto-js";
import { Form, Input, Button, Card } from "antd";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../ui/firebaseConfig";

function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario>(new Usuario());
  const [txtValidacion, setTxtValidacion] = useState<string>("");

  useEffect(() => {
    localStorage.clear();
    if (usuario.rol !== Rol.DEFAULT) {
      storeUserInLocalStorage(usuario);
      navigateToRoleBasedPage(usuario);
    }
  }, [usuario, navigate]);

  const storeUserInLocalStorage = (user: Usuario) => {
    const usuarioParaAlmacenar = {
      username: user.username,
      rol: user.rol,
    };
    localStorage.setItem("usuario", JSON.stringify(usuarioParaAlmacenar));
  };

  const navigateToRoleBasedPage = (user: Usuario) => {
    if (user.rol === Rol.CLIENTE) {
      localStorage.removeItem("sucursal_id");
      localStorage.removeItem("selectedSucursalNombre");
      localStorage.removeItem("empresa_id");
      localStorage.removeItem("id");

      localStorage.setItem("email", user.username);
      localStorage.setItem("rol", "CLIENTE");
      localStorage.setItem("id", String(user.idCliente));
      navigate("/compra");
    } else {
      localStorage.setItem("email", user.username);

      if (user.rol === Rol.ADMINISTRADOR) {
        localStorage.removeItem("sucursal_id");
        localStorage.removeItem("selectedSucursalNombre");
        localStorage.removeItem("empresa_id");
        localStorage.removeItem("id");
        localStorage.setItem("rol", user.rol);
        localStorage.setItem("id", String(user.idEmpleado));
        navigate("/unidadMedida");
      } else if (
        user.rol === Rol.EMPLEADO_COCINA ||
        user.rol === Rol.EMPLEADO_REPARTIDOR
      ) {
        localStorage.setItem("rol", user.rol);
        localStorage.setItem("sucursal_id", user.idSucursal?.toString() || "");
        localStorage.setItem("id", String(user.idEmpleado));
        localStorage.setItem("empresa_id", user.idEmpresa?.toString() || "");
        navigate("/insumos");
      } else {
        navigate("/default");
      }
    }
  };

  const handleLoginResponse = async (response: Response) => {
    if (response.ok) {
      const data: Usuario = await response.json();
      storeUserInLocalStorage(data);
      navigateToRoleBasedPage(data);
    } else {
      setTxtValidacion("Usuario o clave incorrectos");
    }
  };

  const login = async () => {
    if (!usuario?.username) {
      setTxtValidacion("Ingrese el nombre de usuario");
      return;
    }
    if (!usuario?.password) {
      setTxtValidacion("Ingrese la clave");
      return;
    }

    const encryptedPassword = CryptoJS.SHA256(usuario.password).toString();

    const response = await fetch("http://localhost:8080/api/usuario/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usuario.username,
        password: encryptedPassword,
      }),
    });

    await handleLoginResponse(response);
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await fetch(
        `http://localhost:8080/api/usuario/google-login?email=${encodeURIComponent(
          user.email ?? ""
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await handleLoginResponse(response);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card style={{ width: 300 }}>
        <Form>
          <Form.Item label="Usuario">
            <Input
              placeholder="Ingrese el nombre"
              defaultValue={usuario?.username}
              onChange={(e) =>
                setUsuario((prevUsuario) => ({
                  ...prevUsuario,
                  username: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") login();
              }}
            />
          </Form.Item>
          <Form.Item label="Clave">
            <Input.Password
              placeholder="Ingrese la clave"
              defaultValue={usuario?.password}
              onChange={(e) =>
                setUsuario((prevUsuario) => ({
                  ...prevUsuario,
                  password: e.target.value,
                }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") login();
              }}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={login}>
              Ingresar
            </Button>
          </Form.Item>
          {txtValidacion && (
            <p style={{ color: "red", lineHeight: 5, padding: 5 }}>
              {txtValidacion}
            </p>
          )}
          <Form.Item>
            <Button type="primary" onClick={handleGoogleLogin}>
              Iniciar sesión con Google
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;

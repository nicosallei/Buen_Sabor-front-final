import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Rol, Usuario } from "../../../types/usuario/Usuario";
import * as CryptoJS from "crypto-js";
import { Form, Input, Button, Checkbox, Card } from "antd";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons"; // Import EyeTwoTone from @ant-design/icons

function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario>(new Usuario());
  const [txtValidacion, setTxtValidacion] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    localStorage.clear();
    if (usuario.rol !== Rol.DEFAULT) {
      const usuarioParaAlmacenar = {
        username: usuario.username,
        rol: usuario.rol,
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioParaAlmacenar));
      navigate("/login", {
        replace: true,
        state: {
          logged: true,
          usuario: usuarioParaAlmacenar,
        },
      });
    }
  }, [usuario, navigate]);

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

    if (response.ok) {
      const data: Usuario = await response.json();

      if (data.rol === Rol.CLIENTE) {
        localStorage.removeItem("sucursal_id");
        localStorage.removeItem("selectedSucursalNombre");
        localStorage.removeItem("empresa_id");
        localStorage.removeItem("id");

        localStorage.setItem("email", data.username);
        localStorage.setItem("rol", "CLIENTE");
        localStorage.setItem("id", String(data.idCliente));
        navigate("/compra");
      } else {
        localStorage.setItem("email", data.username);

        if (data.rol === Rol.ADMINISTRADOR) {
          localStorage.setItem("rol", data.rol);
          localStorage.removeItem("sucursal_id");
          localStorage.removeItem("selectedSucursalNombre");
          localStorage.removeItem("empresa_id");
          localStorage.removeItem("id");
          navigate("/unidadMedida");
        } else if (
          data.rol === Rol.EMPLEADO_COCINA ||
          data.rol === Rol.EMPLEADO_REPARTIDOR
        ) {
          localStorage.setItem("rol", data.rol);
          localStorage.setItem(
            "sucursal_id",
            data.idSucursal?.toString() || ""
          );
          localStorage.setItem("id", String(data.id));
          localStorage.setItem("empresa_id", data.idEmpresa?.toString() || "");
          navigate("/insumos");
        }

        navigate("/compra", {});
      }
    } else {
      setTxtValidacion("Usuario o clave incorrectos");
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
            <Checkbox
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            >
              Mostrar contraseña
            </Checkbox>
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
        </Form>
      </Card>
    </div>
  );
}

export default Login;

import { useState, useRef, useEffect } from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from "@material-tailwind/react";
import { AiOutlineUpload } from "react-icons/ai";
import Cookies from "universal-cookie";
import axios from "axios";
import { Loader } from "@/widgets";
export default function Editar({ Cerrar, PerDatos }) {
  const [Loading, setLoading] = useState(false);
  const HandleSUbumit = async (e) => {
    try {
      setLoading(true);

      //alert("Buscando");
      /*
       id_persona: "",
    nombres: "",
    apellidos: "",
    correo: "",
    direccion: "",
       */
      const response = await axios.post("http://localhost:4000", {
        jsonrpc: "2.0",
        method: "actualizar_persona",
        params: [
          DataEdit.id_persona,
          DataEdit.nombres,
          DataEdit.apellidos,
          DataEdit.correo,
          DataEdit.direccion,
        ],
        id: 1,
      });
      console.log(response);
      setLoading(false);
      Cerrar();
    } catch (error) {
      setLoading(false);
      alert("Error");
      console.log(error);
    }
  };
  const [DataEdit, setDatEdit] = useState([]);
  useEffect(() => {
    setDatEdit(PerDatos);
    //else buscar_por_id
    //enviar al  servidor para que lo actualice
  }, []);
  return (
    <>
      <Dialog size="xs" open={true} className="bg-transparent shadow-none">
        {Loading && <Loader />}
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Editar
            </Typography>
            {/**INPUTS A LLENAR */}
            <Input
              label="Nombres"
              type="text"
              value={DataEdit.nombres}
              size="lg"
              onChange={(e) =>
                setDatEdit({ ...DataEdit, nombres: e.target.value })
              }
              //onChange={(e) => setDescripcion(e.target.value)}
            />
            <Input
              label="Apellidos"
              type="text"
              size="lg"
              value={DataEdit.apellidos}
              onChange={(e) =>
                setDatEdit({ ...DataEdit, apellidos: e.target.value })
              }
              //onChange={(e) => setDescripcion(e.target.value)}
            />
            <Input
              label="Correo"
              type="text"
              size="lg"
              value={DataEdit.correo}
              onChange={(e) =>
                setDatEdit({ ...DataEdit, correo: e.target.value })
              }
              //onChange={(e) => setDescripcion(e.target.value)}
            />
            <Input
              label="Direccion"
              type="text"
              size="lg"
              value={DataEdit.direccion}
              onChange={(e) =>
                setDatEdit({ ...DataEdit, direccion: e.target.value })
              }
              //onChange={(e) => setDescripcion(e.target.value)}
            />
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              fullWidth
              color="green"
              onClick={HandleSUbumit}
            >
              Editar
            </Button>
            <Button
              variant="gradient"
              onClick={Cerrar}
              fullWidth
              className="mt-2"
              color="red"
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}

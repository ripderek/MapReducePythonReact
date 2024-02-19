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
  const [numeor, setNumero] = useState(0);
  const HandleSUbumit = async (e) => {
    try {
      setLoading(true);
      //console.log(DataEdit);
      //console.log(DataEdit);
      // alert(numeor);
      const response = await axios.post("http://localhost:4000", {
        jsonrpc: "2.0",
        method: "generar_logs",
        params: [DataEdit.archivo, numeor],
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
  return (
    <>
      <Dialog size="xs" open={true} className="bg-transparent shadow-none">
        {Loading && <Loader />}
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Crear .log
            </Typography>
            {/**INPUTS A LLENAR */}
            <Input
              label="Archvio"
              type="text"
              value={DataEdit.archivo}
              size="lg"
              onChange={(e) =>
                setDatEdit({ ...DataEdit, archivo: e.target.value })
              }
              //onChange={(e) => setDescripcion(e.target.value)}
            />
            <Input
              label="Numero de lineas"
              type="number"
              size="lg"
              value={DataEdit.numero}
              onChange={(e) => setNumero(e.target.value)}
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
              Crear
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

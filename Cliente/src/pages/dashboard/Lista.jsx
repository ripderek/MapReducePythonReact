import { useState, useEffect } from "react";

import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import {
  Typography,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Input,
  Button,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const TABLE_HEAD = [
  "",
  "id_persona",
  "nombres",
  "apellidos",
  "correo",
  "direccion",
  "editar",
  "eliminar",
];
import { Loader } from "@/widgets";
import axios from "axios";

import { Editar } from "@/pages/dashboard";
import Cookies from "universal-cookie";
import { VisorPDF } from "@/pages/dashboard";
export default function Lista() {
  const [Loading, setLoading] = useState(false);

  //stado para ver el fomulario de crear persona
  const [verEditar, setVerEditar] = useState(false);
  const [idEditar, setIdEditar] = useState(false);
  const cookies = new Cookies();

  const CerrarEditar = () => {
    setVerEditar(false);
    ObtenerListaDocumentos();
  };
  //crear un useEffect que cargue la lista de los docuemntos obteniendo el correo de la cookie
  //decodeURIComponent(cookies.get("email"))
  const [Lista, setLista] = useState([]);
  useEffect(() => {
    ObtenerListaDocumentos();
    //else buscar_por_id
  }, []);
  const classes = "p-4 border-b border-blue-gray-50";
  //funcion para hacer la peticion y obtener los datos de la pregunta
  const ObtenerListaDocumentos = async () => {
    //alert(id_pregunta + " " + buscar + " " + id_nivel);
    setLoading(true);

    try {
      //alert("Buscando");
      const response = await axios.post("http://localhost:4000", {
        jsonrpc: "2.0",
        method: "obtener_datos",
        id: 1,
      });
      const resultados = await JSON.parse(response.data.result);

      setLista(resultados);
      console.log(resultados);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Error");
      console.log(error);
    }
  };
  const [persona, setpersona] = useState({
    id_persona: "",
    nombres: "",
    apellidos: "",
    correo: "",
    direccion: "",
  });

  return (
    <>
      {Loading && <Loader />}
      {verEditar && <Editar Cerrar={CerrarEditar} PerDatos={persona} />}
      {Lista.length === 0 ? (
        <Typography
          variant="h2"
          color="blue-gray"
          className="font-normal leading-none opacity-70 mx-auto"
        >
          No tiene documentos guardados
        </Typography>
      ) : (
        <>
          <Button className="flex items-center gap-3 mb-4" size="sm">
            <PlusCircleIcon strokeWidth={2} className="h-4 w-4" /> Agregar
            persona
          </Button>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Input
              label="Buscar"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>

          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Lista.map((row, index) => (
                <tr key={index}>
                  <td className={classes}>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {index + 1}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {row[0]}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {row[1]}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {row[2]}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {row[3]}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {row[4]}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <div className="w-max">
                      <Tooltip content="Firmar documento">
                        <IconButton
                          variant="text"
                          onClick={() => (
                            setpersona({
                              ...persona,
                              id_persona: row[0],
                              nombres: row[1],
                              apellidos: row[2],
                              correo: row[3],
                              direccion: row[4],
                            }),
                            setVerEditar(true)
                          )}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>

                  <td className={classes}>
                    <Tooltip content="Eliminar documento">
                      <IconButton variant="text">
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

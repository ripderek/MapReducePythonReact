import { useState, useEffect } from "react";

import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusCircleIcon,
  BoltIcon,
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

const TABLE_HEAD = ["", "Archivo Log", "Eliminar"];
import { Loader } from "@/widgets";
import axios from "axios";

import { Editar, Crear, Ejecutar } from "@/pages/dashboard";

export default function Lista() {
  const [Loading, setLoading] = useState(false);

  //stado para ver el fomulario de crear persona
  const [verEditar, setVerEditar] = useState(false);

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
        method: "listar_archivos_log",
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

  //funcion para buscar y obtener el contenido deun log
  const [contenidoLog, setCOntenidoLog] = useState([]);
  const ObtenerContenido = async (nombreLog) => {
    //alert(id_pregunta + " " + buscar + " " + id_nivel);
    setLoading(true);

    try {
      //alert("Buscando");
      const response = await axios.post("http://localhost:4000", {
        jsonrpc: "2.0",
        method: "leer_archivo_log",
        params: [nombreLog],
        id: 1,
      });
      const resultados = await JSON.parse(response.data.result);

      setCOntenidoLog(resultados);
      console.log(resultados);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Error");
      console.log(error);
    }
  };
  //funcion para eliminar un archivo log skere modo diablo
  const EliminarArchivo = async (nombreLog) => {
    //alert(id_pregunta + " " + buscar + " " + id_nivel);
    setLoading(true);

    try {
      //alert("Buscando");
      const response = await axios.post("http://localhost:4000", {
        jsonrpc: "2.0",
        method: "eliminar_archivo_log",
        params: [nombreLog],
        id: 1,
      });
      //const resultados = await JSON.parse(response.data.result);
      ObtenerListaDocumentos();
      //setCOntenidoLog(resultados);
      //console.log(resultados);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Error");
      console.log(error);
    }
  };
  //constante para abrir el dialogo de ejecutar el mapreducer
  const [openEjectuar, setOpenEjecutar] = useState(false);
  const CerrarEjecutar = () => {
    setOpenEjecutar(false);
  };
  return (
    <>
      {openEjectuar && <Ejecutar cerrar={CerrarEjecutar} />}
      {Loading && <Loader />}
      {verEditar && <Editar Cerrar={CerrarEditar} />}

      <>
        <div className="flex ">
          <Button
            className="flex items-center gap-3 rounded-none "
            size="sm"
            color="indigo"
            variant="gradient"
            onClick={() => setVerEditar(true)}
          >
            <PlusCircleIcon strokeWidth={2} className="h-4 w-4" /> Crear Log
          </Button>
          <Button
            className="flex items-center gap-3  ml-3 rounded-none"
            size="sm"
            variant="gradient"
            onClick={() => setOpenEjecutar(true)}
          >
            <BoltIcon strokeWidth={2} className="h-4 w-4" /> Ejecutar MapReduce
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2  p-5  ">
          <div className="mx-auto h-96 overflow-y-auto">
            <table className="mt-4 w-96 min-w-max table-auto text-left ">
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
                  <tr
                    key={index}
                    className="hover:bg-blue-gray-100  cursor-pointer"
                  >
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
                    <td
                      className={classes}
                      onClick={() => ObtenerContenido(row)}
                    >
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {row}
                        </Typography>
                      </div>
                    </td>
                    {/* 
                  <td className={classes}>
                    <div className="w-max">
                      <Tooltip content="Ver contenido">
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
                          <EyeIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
*/}
                    <td className={classes}>
                      <Tooltip content="Eliminar documento">
                        <IconButton
                          variant="text"
                          onClick={() => EliminarArchivo(row)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="">
            {/* AQUI VA LA TABLA CON EL CONTENIDO DE LOS LOGS SKERE MOD DIABLO */}

            <Typography variant="h5" color="black">
              Contenido del .log
            </Typography>
            <div className="overflow-y-auto h-96 border-2 border-black bg-blue-gray-50">
              <tbody>
                {contenidoLog.map(({ ID, tipo }, index) => (
                  <tr key={index} className="">
                    <td className="p-1 border-r border-blue-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="indigo"
                            className="font-bold"
                          >
                            {ID}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className="p-1 ">
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {tipo}
                        </Typography>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </div>
          </div>
        </div>
      </>
    </>
  );
}

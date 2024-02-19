import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { Loader } from "@/widgets";
import axios from "axios";
export default function Ejecutar({ cerrar }) {
  const [Loading, setLoading] = useState(false);
  useEffect(() => {
    ObtenerListaDocumentos();
  }, []);
  const [Lista, setLista] = useState([]);
  const ObtenerListaDocumentos = async () => {
    //alert(id_pregunta + " " + buscar + " " + id_nivel);
    setLoading(true);
    try {
      //alert("Buscando");
      const response = await axios.post("http://localhost:4000", {
        jsonrpc: "2.0",
        method: "MapReducer",
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
  const classes = "p-4 border-b border-blue-gray-50";

  return (
    <>
      {Loading && <Loader />}

      <Dialog open={true} handler={cerrar} className="rounded-none" size="sm">
        <DialogHeader>Resultados del MapReducer</DialogHeader>
        <DialogBody>
          <div className="mx-auto h-96 overflow-y-auto">
            <table className="mt-4 w-full min-w-max table-auto text-left ">
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
                    <td className={classes}>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="gradient"
            color="red"
            onClick={cerrar}
            className="mr-1"
          >
            <span>Cerrar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

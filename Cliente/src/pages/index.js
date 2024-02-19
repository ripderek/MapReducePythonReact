import { useState } from 'react'
import { Home, Crear, Menu, Lista } from '@/pages/dashboard'

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { Navbar_app } from '@/widgets'

export default function Aplicacion() {
  //stado para ver el fomulario de crear persona
  const [verCrear, setVerCrear] = useState(false);
  const CerrarCrear = () => {
    setVerCrear(false);
  }
  return (
    <>
      <Navbar_app titulo={"Aplicacion Distribuida"} />
      {verCrear && <Crear Cerrar={CerrarCrear} />}
      <Card className="h-full w-full">

        <CardBody className="overflow-scroll px-0 p-5">
          <div className="mb-2 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Aplicaciones Distribuidas
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Pyhton & React
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            </div>
          </div>
          <Lista />

        </CardBody>
      </Card>
    </>
  );
}
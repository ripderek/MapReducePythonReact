import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Chip,
  Tooltip,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
  UserIcon,
  ArrowsPointingOutIcon,
  ArrowLongLeftIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";

import Cookies from "universal-cookie";
import { useEffect, useState } from "react";

export function Navbar_app({ titulo }) {
  return (
    <Navbar
      className="sticky top-4 z-40 py-3  border-4 border-black bg-white border-none rounded-none mb-4"
      fullWidth
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Typography variant="h4" color="black">
            RPC en python y consumido en React
          </Typography>
        </div>
      </div>
    </Navbar>
  );
}
export default Navbar_app;

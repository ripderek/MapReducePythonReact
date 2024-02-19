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

export function Navbar_app({ titulo }) {
  return (
    <Navbar
      className=" z-40 py-3   bg-black border-none rounded-none"
      fullWidth
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center text-white">
        <div className="capitalize text-white mt-4">
          <Typography variant="h4" color="white">
            RPC y MapReducer en python
          </Typography>
        </div>
      </div>
    </Navbar>
  );
}
export default Navbar_app;

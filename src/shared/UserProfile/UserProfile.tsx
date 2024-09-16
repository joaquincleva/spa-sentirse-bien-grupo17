import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ArrowLeftEndOnRectangleIcon from "@heroicons/react/16/solid/ArrowLeftEndOnRectangleIcon";
import { UserCircleIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useAuthContext } from "@/Context/AuthContext";
const ProfileMenu = () => {
  const {authUser, setAuthUser} = useAuthContext()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-row items-center gap-2 text-white cursor-pointer transition duration-300 ease-in-out hover:bg-primary hover:text-white rounded px-3 py-1">
          <div className="flex  items-center gap-2">
            <Avatar>
              {/* eslint-disable-next-line */}
              <img src={authUser?.avatar} alt={authUser?.username} width={100} height={100} />
            </Avatar>
            <div className="hidden md:block">
              <p className="font-semibold text-sm text-black">{authUser?.username}</p>
            </div>
          </div>
          <div>
            <ChevronDownIcon />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent alignOffset={50}>
        <DropdownMenuLabel className="md:hidden">{authUser?.username}</DropdownMenuLabel>
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center">
          <Link href={"/perfil"} className="flex items-center">
            <div className="flex items-center">
              <UserCircleIcon className="mr-2 h-4 w-4" />
              <span>Mi Cuenta</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
            localStorage.removeItem("user")
            setAuthUser(null)
          }}>
          <ArrowLeftEndOnRectangleIcon className="mr-2 h-4 w-4" />
          Desconectarme
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;

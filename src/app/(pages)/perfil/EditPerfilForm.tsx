"use client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useFormik, FormikProps } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import {
  serviceCreateUser,
  serviceEditUserId,
  serviceGetAllUsers,
} from "@/services/users.service";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/Context/AuthContext";
import { User } from "@/interfaces/User.interface";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const validationSchemaFormRegister = Yup.object({
  username: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .required("El nombere es obligatorio."),
  password: Yup.string()
    .min(4, "La contraseña debe tener al menos 4 caracteres.")
    .required("La contraseña es obligatoria."),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir.")
    .required("Confirmar la contraseña es obligatorio."),
  direccion: Yup.string()
    .min(5, "La dirección debe tener al menos 5 caracteres.")
    .required("La dirección es obligatoria."),
  ciudad: Yup.string()
    .min(4, "La ciudad debe tener al menos 4 caracteres.")
    .required("La ciudad es obligatoria."),
  avatar: Yup.string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "Ingrese una url válida"
    )
    .required("Ingrese una url"),
});

export type EditUserProp = {
  direccion: string;
  ciudad: string;
  password: string;
  repeatPassword: string;
  username: string;
  avatar: string;
};

export const initialValues = {
  direccion: "",
  ciudad: "",
  password: "",
  repeatPassword: "",
  username: "",
  avatar: "",
};

interface EditUserFormProps extends React.HTMLAttributes<HTMLFormElement> {
  setEditMode: (arg: boolean) => void;
}

export const EditUserForm: React.FC<EditUserFormProps> = ({
  className,
  setEditMode,
  ...props
}) => {
  const router = useRouter();
  const { authUser, setAuthUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  const initialValues = {
    direccion: authUser?.direccion ?? "",
    ciudad: authUser?.ciudad ?? "",
    password: authUser?.password ?? "",
    repeatPassword: authUser?.password ?? "",
    username: authUser?.username ?? "",
    avatar: authUser?.avatar ?? "",
  };

  useEffect(() => {
    const usersFetch: any = async () => {
      setIsLoading(true);
      try {
        const responseUsers = await serviceGetAllUsers();
        setUsers(responseUsers);
      } catch (e) {
        console.error("Ha ocurrido un error en la petición");
        toast({
          description: "No se ha podido editar los usuarios.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    usersFetch();
  }, []);

  const formik: FormikProps<EditUserProp> = useFormik<EditUserProp>({
    initialValues: initialValues,
    validationSchema: validationSchemaFormRegister,
    onSubmit: async (values: EditUserProp) => {
      setIsLoading(true);
      try {
        const { repeatPassword, ...userData } = values;
        await serviceEditUserId(authUser?.id ?? "", {
          ...userData,
          rol: "usuario",
        });
        setAuthUser({
          ...userData,
          rol: authUser?.rol ?? "usuario",
          id: authUser?.id ?? "",
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...userData,
            rol: authUser?.rol ?? "usuario",
            id: authUser?.id ?? "",
          })
        );
        setEditMode(false);
      } catch (error) {
        console.error("Error al crear el usuario:", error);
        toast({
          description: "No se ha podido crear el usuario.",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit(e);
      }}
      className={cn("grid gap-6 w-3/4 lg:w-1/2", className)}
      {...props}
    >
      <FormCreateAccountFields
        isLoading={isLoading}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        formik={formik}
        showPassword2={false}
        setShowPassword2={function (
          value: React.SetStateAction<boolean>
        ): void {
          throw new Error("Function not implemented.");
        }}
      />
      <Button
        type="submit"
        disabled={isLoading || !formik.isValid}
        className="rounded-full"
      >
        Editar cuenta
      </Button>
    </form>
  );
};

interface FormCreateAccountFieldsProps {
  isLoading: boolean;
  showPassword2: boolean;
  setShowPassword2: React.Dispatch<React.SetStateAction<boolean>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  formik: FormikProps<EditUserProp>;
}

const FormCreateAccountFields: React.FC<FormCreateAccountFieldsProps> = ({
  isLoading,
  showPassword,
  setShowPassword,
  formik,
}) => (
  <div className="grid gap-4">
    <div className="grid gap-2">
      <Label className="sr-only" htmlFor="username">
        Nombre de usuario
      </Label>
      <Input
        id="username"
        placeholder="Usuario 1"
        type="text"
        autoCapitalize="words"
        autoComplete="given-name"
        autoCorrect="off"
        disabled={isLoading}
        {...formik.getFieldProps("username")}
      />
      {formik.touched.username && formik.errors.username && (
        <Label className="text-xs ml-1 text-red-500">
          {formik.errors.username}
        </Label>
      )}
    </div>
    <div className="relative grid gap-2">
      <Label className="sr-only" htmlFor="password">
        Contraseña
      </Label>
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder="Contraseña"
        autoCapitalize="none"
        autoComplete="new-password"
        autoCorrect="off"
        disabled={isLoading}
        {...formik.getFieldProps("password")}
      />
      <PasswordToggle
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
      {formik.touched.password && formik.errors.password && (
        <Label className="   text-xs ml-1 text-red-500">
          {formik.errors.password}
        </Label>
      )}
    </div>
    <div className="relative grid gap-2">
      <Label className="sr-only" htmlFor="repeatPassword">
        Repetir Contraseña
      </Label>
      <div className="relative">
        <Input
          id="repeatPassword"
          type={showPassword ? "text" : "password"}
          placeholder="Repetir Contraseña"
          autoCapitalize="none"
          autoComplete="new-password"
          autoCorrect="off"
          disabled={isLoading}
          {...formik.getFieldProps("repeatPassword")}
        />
      </div>
      {formik.touched.repeatPassword && formik.errors.repeatPassword && (
        <Label className=" text-xs ml-1 text-red-500">
          {formik.errors.repeatPassword}
        </Label>
      )}
    </div>
    <div className="grid gap-2">
      <Label className="sr-only" htmlFor="direccion">
        Dirección
      </Label>
      <Input
        id="direccion"
        placeholder="Av. Sarmiento 55"
        type="text"
        autoCapitalize="words"
        autoComplete="given-name"
        autoCorrect="off"
        disabled={isLoading}
        {...formik.getFieldProps("direccion")}
      />
      {formik.touched.direccion && formik.errors.direccion && (
        <Label className="text-xs ml-1 text-red-500">
          {formik.errors.direccion}
        </Label>
      )}
    </div>
    <div className="grid gap-2">
      <Label className="sr-only" htmlFor="ciudad">
        Ciudad
      </Label>
      <Input
        id="ciudad"
        placeholder="Resistencia"
        type="text"
        autoCapitalize="words"
        autoComplete="given-name"
        autoCorrect="off"
        disabled={isLoading}
        {...formik.getFieldProps("ciudad")}
      />
      {formik.touched.ciudad && formik.errors.ciudad && (
        <Label className="text-xs ml-1 text-red-500">
          {formik.errors.ciudad}
        </Label>
      )}
    </div>
    <div className="relative grid gap-2">
      <Label className="sr-only" htmlFor="avatar">
        Avatar
      </Label>
      <Input
        id="avatar"
        placeholder="Link de la imagen"
        type="text"
        autoCapitalize="words"
        autoComplete="given-name"
        autoCorrect="off"
        disabled={isLoading}
        {...formik.getFieldProps("avatar")}
      />
      <div className="absolute inset-y-0 end-[-90px] flex items-center ps-3.5 z-10">
        {formik.touched.avatar &&
          !formik.errors.avatar &&
          formik.values.avatar && ( //eslint-disable-next-line
            <img
              src={formik.values.avatar}
              alt="Imagen no reconocida"
              width={75}
              height={75}
              className="h-20 w-20 dark:text-gray-400 rounded-xl"
            />
          )}
      </div>
      {formik.touched.avatar && formik.errors.avatar && (
        <Label className="text-xs ml-1 text-red-500">
          {formik.errors.avatar}
        </Label>
      )}
    </div>
  </div>
);

interface PasswordToggleProps {
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordToggle: React.FC<PasswordToggleProps> = ({
  showPassword,
  setShowPassword,
}) => (
  <div
    className="absolute inset-y-0 end-4 flex items-center ps-3.5 z-10 hover:cursor-pointer"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? (
      <EyeSlashIcon className="w-4 h-4 dark:text-gray-400" />
    ) : (
      <EyeIcon className="w-4 h-4 dark:text-gray-400" />
    )}
  </div>
);

export default EditUserForm;

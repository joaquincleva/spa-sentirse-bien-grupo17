import { Service } from "@/interfaces/Service.interface";
import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { serviceEditServiceId } from "@/services/services.service";
import { useToast } from "@/hooks/use-toast";

interface EditServiceProps {
  setEditMode: (arg: boolean) => void;
  service: Service | null;
  setService: (arg: Service) => void;
}

export const validationSchemaEditService = Yup.object({
  nombre: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .required("El nombre es obligatorio."),
  descripcion: Yup.string()
    .min(20, "Debe ser mayor que 20 caracteres")
    .required("La descripción es obligatoria."),
  precio: Yup.number()
    .min(5000, "No se puede poner precios más baratos que 5000.")
    .required("El precio es obligatorio."),
  imagen: Yup.string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "Ingrese una url de imagen válida"
    )
    .required("Ingrese la url de una imagen"),
});

const EditServiceForm = ({
  setEditMode,
  service,
  setService,
}: EditServiceProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const initialValues = {
    id: service?.id ?? "",
    categoria_servicio_id: service?.categoria_servicio_id ?? "",
    imagen: service?.imagen ?? "",
    descripcion: service?.descripcion ?? "",
    nombre: service?.nombre ?? "",
    precio: service?.precio ?? "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchemaEditService,
    onSubmit: async (values) => {
      setLoading(true);
      let serviceAModificar = {
        categoria_servicio_id: formik.values.categoria_servicio_id,
        descripcion: formik.values.descripcion,
        nombre: formik.values.nombre,
        precio: Number(formik.values.precio),
        imagen: formik.values.imagen,
        id: formik.values.id,
      };
      try {
        await serviceEditServiceId(service?.id ?? "", serviceAModificar);
        setService(serviceAModificar);
        setEditMode(false);
      } catch (e) {
        console.log("Error al modificar servicio");

        toast({
          description: "No se ha podido modificar el servicio.",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form
      className="w-10/12 md:w-2/3"
      onSubmit={(e) => {
        formik.handleSubmit(e);
      }}
    >
      <Card className="w-full flex-col p-4 px-8 gap-4 rounded-lg flex my-10 items-center bg-slate-50 justify-around">
        <div className="grid gap-2 w-full">
          <Label htmlFor="nombre">Nombre del servicio</Label>
          <Input
            id="nombre"
            placeholder="Nombre del servicio"
            type="text"
            autoCapitalize="words"
            autoComplete="given-name"
            autoCorrect="off"
            {...formik.getFieldProps("nombre")}
          />
          {formik.touched.nombre && formik.errors.nombre && (
            <Label className="text-xs ml-1 text-red-500">
              {formik.errors.nombre}
            </Label>
          )}
        </div>
        <div className="grid gap-2 w-full">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            className="min-h-[250px] text-justify"
            id="descripcion"
            placeholder="Descripción del servicio"
            autoCapitalize="words"
            autoComplete="given-name"
            autoCorrect="off"
            {...formik.getFieldProps("descripcion")}
          />
          {formik.touched.descripcion && formik.errors.descripcion && (
            <Label className="text-xs ml-1 text-red-500">
              {formik.errors.descripcion}
            </Label>
          )}
        </div>
        <div className="grid gap-2 w-full">
          <Label htmlFor="imagen">Imagen del servicio</Label>
          <Input
            id="imagen"
            placeholder="Imagen del servicio"
            type="text"
            autoCapitalize="words"
            autoComplete="given-name"
            autoCorrect="off"
            {...formik.getFieldProps("imagen")}
          />
          {formik.touched.imagen && formik.errors.imagen && (
            <Label className="text-xs ml-1 text-red-500">
              {formik.errors.imagen}
            </Label>
          )}
        </div>
        <div className="grid gap-2 w-full">
          <Label htmlFor="precio">Precio del servicio</Label>
          <Input
            id="precio"
            placeholder="Precio del servicio"
            type="number"
            autoCapitalize="words"
            autoComplete="given-name"
            autoCorrect="off"
            {...formik.getFieldProps("precio")}
          />
          {formik.touched.precio && formik.errors.precio && (
            <Label className="text-xs ml-1 text-red-500">
              {formik.errors.precio}
            </Label>
          )}
        </div>
        <Button
          type="submit"
          disabled={loading || !formik.isValid}
          className="rounded-md"
        >
          Editar servicio
        </Button>
      </Card>
    </form>
  );
};

export default EditServiceForm;

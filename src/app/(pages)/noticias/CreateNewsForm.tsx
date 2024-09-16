import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { News } from "@/interfaces/News.interface";
import { serviceCreateNews, serviceEditNewsId } from "@/services/news.service";
import { useToast } from "@/hooks/use-toast";

interface EditNewsProps {
  setEditMode: (arg: boolean) => void;
}

export const validationSchemaEditNews = Yup.object({
  titulo: Yup.string()
    .min(3, "El titulo debe tener al menos 3 caracteres.")
    .required("El titulo es obligatorio."),
  contenido: Yup.string()
    .min(20, "Debe ser mayor que 20 caracteres")
    .required("La descripción es obligatoria."),
  imagen: Yup.string()
    .matches(
      /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
      "Ingrese una url de imagen válida"
    )
    .required("Ingrese la url de una imagen"),
});

const CreateNewsForm = ({
  setEditMode
}: EditNewsProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const initialValues = {
    imagen: "",
    contenido: "",
    titulo: "",
  };
  const {toast} = useToast()

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchemaEditNews,
    onSubmit: async (values) => {
      console.log(values)
      setLoading(true);
      let noticiaAModificar = {
        id: "",
        imagen: formik.values.imagen,
        contenido: formik.values.contenido,
        titulo: formik.values.titulo,
        publish_date: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
      };
      try {
        await serviceCreateNews(noticiaAModificar);
        setEditMode(false);
      } catch (e) {
        console.log("Error al crear noticia");
        toast({
          description: "No se ha podido crear la noticias."
        })
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form
      className="w-5/6 md:w-2/3"
      onSubmit={(e) => {
        formik.handleSubmit(e);
      }}
    >
      <Card className="w-full flex-col p-4 px-8 gap-4 rounded-lg flex my-10 items-center bg-slate-50 justify-around">
        <div className="grid gap-2 w-full">
          <Label htmlFor="titulo">Titulo de la noticia</Label>
          <Input
            id="titulo"
            placeholder="Titulo de la noticia"
            type="text"
            autoCapitalize="words"
            autoComplete="given-name"
            autoCorrect="off"
            {...formik.getFieldProps("titulo")}
          />
          {formik.touched.titulo && formik.errors.titulo && (
            <Label className="text-xs ml-1 text-red-500">
              {formik.errors.titulo}
            </Label>
          )}
        </div>
        <div className="grid gap-2 w-full">
          <Label htmlFor="contenido">Descripción</Label>
          <Textarea
            className="min-h-[250px] text-justify"
            id="contenido"
            placeholder="Contenido de la noticia"
            autoCapitalize="words"
            autoComplete="given-name"
            autoCorrect="off"
            {...formik.getFieldProps("contenido")}
          />
          {formik.touched.contenido && formik.errors.contenido && (
            <Label className="text-xs ml-1 text-red-500">
              {formik.errors.contenido}
            </Label>
          )}
        </div>
        <div className="grid gap-2 w-full">
          <Label htmlFor="imagen">Imagen de la noticia</Label>
          <Input
            id="imagen"
            placeholder="Imagen de la noticia"
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
        <Button
          type="submit"
          disabled={loading || !formik.isValid}
          className="rounded-md"
        >
          Crear noticia
        </Button>
      </Card>
    </form>
  );
};

export default CreateNewsForm;

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthContext } from "@/Context/AuthContext";
import LoadingSpinner from "@/shared/LoadingSpinner/LoadingSpinner";
import React, { useEffect, useState } from "react";
import { format, getTime, set } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  serviceDeleteTurno,
  serviceGetAllTurnos,
  serviceCreateTurno,
} from "@/services/turnos.service";
import { serviceGetAllServices } from "@/services/services.service";
import { serviceGetAllUsers } from "@/services/users.service";
import { User } from "@/interfaces/User.interface";
import { Service } from "@/interfaces/Service.interface";
import { Turno } from "@/interfaces/Turnos.interface";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/solid";

interface Horarios {
  label: string;
  value: number;
}

const Page = ({ params }: any) => {
  const { authUser } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [selectedHour, setSelectedHour] = useState<number>();
  const [selectedService, setSelectedService] = useState<string | undefined>(
    params?.slug ?? ""
  );
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [users, setUsers] = useState<User[] | any[]>([]);
  const [services, setServices] = useState<Service[] | any[]>([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState<Horarios[]>(
    []
  );
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    console.log(authUser);
    const timer = setTimeout(() => {
      if (!authUser) {
        router.push("/auth/login");
      }
    }, 2000);

    return () => clearTimeout(timer);
    //eslint-disable-next-line
  }, [authUser]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [responseUsers, responseServices, responseTurnos] =
          await Promise.all([
            serviceGetAllUsers(),
            serviceGetAllServices(),
            serviceGetAllTurnos(),
          ]);
        setUsers(responseUsers);
        setServices(responseServices);
        setTurnos(responseTurnos);
      } catch (e) {
        console.error("Ha ocurrido un error en la petición", e);

        toast({
          description: "Ha ocurrido un error en la petición.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const horarios = generarHorariosDisponibles();
    setHorariosDisponibles(horarios);
  }, [selectedDate]);

  const generarHorariosDisponibles = () => {
    const horarios: Horarios[] = [];
    const horaInicio = 8;
    const horaFin = 18;

    for (let hora = horaInicio; hora < horaFin; hora++) {
      const horaCompleta = { label: `${hora}:00`, value: hora * 3600 };
      const mediaHora = { label: `${hora}:30`, value: hora * 3600 + 1800 };

      horarios.push(horaCompleta);
      horarios.push(mediaHora);
    }

    return horarios;
  };

  const eliminarTurno = async (id: string) => {
    try {
      await serviceDeleteTurno(id);
      const responseTurnos = await serviceGetAllTurnos();
      setTurnos(responseTurnos);
    } catch (e) {
      console.error("Error eliminando el turno", e);

      toast({
        description: "No se ha podido eliminar el usuario.",
      });
    }
  };

  const solicitarTurno = async () => {
    if (!selectedService || !selectedHour || !selectedDate || !authUser?.id)
      return;

    const fechaEnSegundos = getTime(selectedDate) / 1000 + selectedHour;
    const newTurno: Omit<Turno, "id"> = {
      fecha: { seconds: fechaEnSegundos, nanoseconds: 0 },
      usuario_id: authUser.id,
      servicio_id: selectedService,
    };

    try {
      await serviceCreateTurno(newTurno);
      const responseTurnos = await serviceGetAllTurnos();
      console.log("me ejecuto");
      setTurnos(responseTurnos);
    } catch (e) {
      console.error("Error solicitando el turno", e);
      toast({
        description: "No se ha podido editar el usuario.",
      });
    }
  };

  const turnosDelDia = turnos.filter((turno) => {
    const fechaEnSegundos = getTime(selectedDate ?? 0) / 1000;
    return (
      turno.fecha.seconds >= fechaEnSegundos &&
      turno.fecha.seconds < fechaEnSegundos + 86400 &&
      turno.fecha.seconds === fechaEnSegundos + (selectedHour ?? 0)
    );
  });

  return (
    <div className="px-10 md:px-20 lg:px-48 w-full flex justify-center h-full flex-col items-center bg-[url('/background-image.png')] bg-bottom bg-no-repeat bg-[length:2000px_500px]">
      <h1 className="text-3xl mt-5 font-bold text-center">
        Reservá tu tuno seleccionando el día y la hora
      </h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Card className="w-full flex flex-col md:flex-row h-full md:h-2/3 gap-4 p-5">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2">
              Turnos para {format(selectedDate || new Date(), "dd/MM/yyyy")}
            </h2>
            <Calendar
              fromDate={new Date()}
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="bg-white h-auto rounded-md border"
            />
          </div>

          <div className="mt-3">
            <div className="">
              <h2 className="text-xl font-bold mt-4 mb-2 text-center">
                Selecciona un horario disponible
              </h2>
              <div className="grid lg:grid-cols-10 grid-cols-4 gap-4">
                {horariosDisponibles.map((horario, index) => {
                  // Verificar si ya existe un turno en este horario
                  const isTurnoReservado = turnos.some((turno) => {
                    const fechaEnSegundos = getTime(selectedDate ?? 0) / 1000;
                    return (
                      turno.fecha.seconds >= fechaEnSegundos &&
                      turno.fecha.seconds < fechaEnSegundos + 86400 &&
                      turno.fecha.seconds === fechaEnSegundos + horario.value
                    );
                  });
                  const isTurnoReservadoPorUser = turnos.some((turno) => {
                    const fechaEnSegundos = getTime(selectedDate ?? 0) / 1000;
                    return (
                      turno.fecha.seconds >= fechaEnSegundos &&
                      turno.fecha.seconds < fechaEnSegundos + 86400 &&
                      turno.fecha.seconds === fechaEnSegundos + horario.value &&
                      turno.usuario_id === authUser?.id
                    );
                  });

                  return (
                    <Button
                      variant={
                        selectedHour === horario.value
                          ? "secondary"
                          : isTurnoReservado
                          ? "destructive"
                          : "default"
                      }
                      key={index}
                      onClick={() => setSelectedHour(horario.value)}
                      disabled={
                        authUser?.rol === "admin" ||
                        authUser?.rol === "personal" ||
                        isTurnoReservadoPorUser
                          ? false
                          : isTurnoReservado
                      } // Si quieres deshabilitar el botón si el turno ya está reservado
                    >
                      {horario.label}
                    </Button>
                  );
                })}
              </div>
            </div>
            {turnosDelDia.length > 0
              ? turnosDelDia.map((turno) => {
                  const servicio =
                    services.find((service) => service.id === turno.servicio_id)
                      ?.nombre || "N/A";
                  const usuario =
                    users.find((user) => user.id === turno.usuario_id)
                      ?.username || "N/A";

                  return (
                    <Card key={turno.id} className="my-4 p-4">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                        <div>
                          <p>
                            <span className="font-bold">Hora</span>:{" "}
                            {new Date(
                              turno.fecha.seconds * 1000
                            ).toLocaleTimeString()}
                          </p>
                          <p>
                            <span className="font-bold">Servicio: </span>
                            {servicio}
                          </p>
                          {(authUser?.id === turno.usuario_id ||
                            authUser?.rol === "admin" ||
                            authUser?.rol === "personal") && (
                            <p>
                              <span className="font-bold">Usuario: </span>
                              {usuario}
                            </p>
                          )}
                        </div>
                        {(authUser?.id === turno.usuario_id ||
                          authUser?.rol === "admin" ||
                          authUser?.rol === "personal") && (
                          <Button
                            className=" mt-4 lg:mt-0 self-center"
                            variant="destructive"
                            onClick={() => eliminarTurno(turno.id)}
                          >
                            Eliminar turno
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })
              : authUser &&
                authUser.rol === "usuario" &&
                selectedHour && (
                  <div className="w-full flex lg:flex-row flex-col justify-around  mt-6 p-4 items-center ">
                    <div className="flex flex-col justify-center lg:h-1/2 items-center ">
                      <h2 className="text-xl font-bold">
                        Selecciona un servicio
                      </h2>
                      <select
                        onChange={(e) => setSelectedService(e.target.value)}
                        value={selectedService}
                        className="bg-white border rounded p-2"
                      >
                        <option value="">Seleccione un servicio</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      disabled={!selectedService}
                      onClick={solicitarTurno}
                      className="mt-4"
                    >
                      Solicitar turno
                    </Button>
                  </div>
                )}
          </div>
        </Card>
      )}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-center">Formas de pago</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <CurrencyDollarIcon className="text-red-500 w-6 h-6" />
              <p>Depósito o Transferencia Bancaria</p>
            </div>
            <div className="flex items-center gap-4">
              <DevicePhoneMobileIcon className="text-green-600 w-6 h-6" />
              <p>Mercadopago - Tarjetas Online, PagoFacil, RapiPago</p>
            </div>
            <div className="flex items-center gap-4">
              <CreditCardIcon className="text-yellow-500 w-6 h-6" />
              <p>Tarjetas de crédito ¡Hasta 12 cuotas!</p>
            </div>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;

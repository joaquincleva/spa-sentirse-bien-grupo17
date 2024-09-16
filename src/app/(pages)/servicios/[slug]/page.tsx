"use client";
import React, { useEffect, useRef, useState } from "react";
import { Comment } from "@/interfaces/Comments.interface";
import { User } from "@/interfaces/User.interface";
import { serviceGetAllUsers } from "@/services/users.service";
import {
  serviceGetComments,
  serviceAddComment,
  serviceToggleLike,
} from "@/services/comments.service";
import LoadingSpinner from "@/shared/LoadingSpinner/LoadingSpinner";
import { Service } from "@/interfaces/Service.interface";
import { serviceGetServiceById } from "@/services/services.service";
import { HeartIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/Context/AuthContext";
import EditServiceForm from "./EditServiceForm";
import { useToast } from "@/hooks/use-toast";

const Page = ({ params }: any) => {
  const [service, setService] = useState<Service | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newComment, setNewComment] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const { authUser } = useAuthContext();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const responseService = await serviceGetServiceById(`${params.slug}`);
        const responseComments = await serviceGetComments(
          "servicio",
          `${params.slug}`
        );
        const responseUsers = await serviceGetAllUsers();

        if (responseService) setService(responseService);
        if (responseComments) {
          const sortedComments = responseComments.sort(
            (a, b) => b.likes - a.likes
          );
          setComments(sortedComments);
        }
        if (responseUsers) setUsers(responseUsers);
      } catch (e) {
        console.error("Ha ocurrido un error en la petición");

        toast({
          description: "Ha ocurrido un error en la petición.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const [isPast, setIsPast] = useState(false);
  const comprasRef = useRef(null);
  const handleScroll = () => {
    const comprasElement: any = comprasRef.current;
    if (comprasElement) {
      const rect = comprasElement.getBoundingClientRect();
      const isPast = rect.top < 0;
      setIsPast(isPast);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getUserById = (id: string) => users.find((user) => user.id === id);

  const handleAddComment = async () => {
    const comment: Omit<Comment, "id"> = {
      contenido: newComment,
      likes: 0,
      publish_date: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
      usuario_id: authUser ? authUser.id : "",
      servicio_id: params.slug || "",
    };

    await serviceAddComment(comment);
    setNewComment("");
    const updatedComments = await serviceGetComments(
      "servicio",
      `${params.slug}`
    );
    const sortedComments = updatedComments.sort((a, b) => b.likes - a.likes);
    setComments(sortedComments);
  };

  const handleToggleLike = async (commentId: string, currentLikes: number) => {
    let likesDados = JSON.parse(localStorage.getItem("likes") || "[]");
    const likeDado = likesDados.some((item: string) => item === commentId);

    if (likeDado) {
      await serviceToggleLike(commentId, currentLikes - 1);
      likesDados = likesDados.filter((item: string) => item !== commentId);
    } else {
      await serviceToggleLike(commentId, currentLikes + 1);
      likesDados.push(commentId);
    }
    localStorage.setItem("likes", JSON.stringify(likesDados));
    const updatedComments = await serviceGetComments(
      "servicio",
      `${params.slug}`
    );

    const sortedComments = updatedComments.sort((a, b) => b.likes - a.likes);
    setComments(sortedComments);
  };

  return (
    <div
      className={`w-screen flex justify-center flex-col items-center bg-[url('/background-image.png')] bg-bottom bg-no-repeat bg-[length:2000px_500px]`}
    >
      {loading ? (
        <LoadingSpinner />
      ) : !editMode ? (
        <div className="w-full flex flex-col items-end px-12">
          <div
            className="flex-col text-center sm:flex md:flex z-50 pt-16 "
            id="compras"
            ref={comprasRef}
          >
            {authUser?.rol === "admin" || authUser?.rol === "personal" ? (
              <Button
                variant={"default"}
                onClick={() => {
                  setEditMode(true);
                }}
                className={`bg-green-700 hover:bg-green-800 text-white flex self-end text-2xl p-3 items-center justify-center rounded-lg ${
                  isPast ? "top-10 right-12 lg:right-12 fixed" : ""
                }`}
              >
                Editar servicio
              </Button>
            ) : (
              <Link
                href={`${!authUser ? "/auth/login" : "/turnos/" + params.slug}`}
                className={`bg-red-400 text-white flex self-end text-3xl p-2 items-center justify-center rounded-lg ${
                  isPast ? "top-10 right-12 lg:right-12 fixed" : ""
                }`}
              >
                Reservar turno
              </Link>
            )}
          </div>
          <div className="w-full flex my-10 flex-col items-center justify-center px-4 md:px-16 lg:px-52">
            {/* eslint-disable-next-line */}
            <img
              className="rounded-xl"
              src={service?.imagen}
              alt={service?.nombre}
            />
            <h2 className="text-4xl text-center my-8 font-extrabold text-gray-800 leading-tight">
              {service && service.nombre}
            </h2>
            <div className="text-lg font-medium text-justify text-gray-700 mt-4">
              {service &&
                service.descripcion.split(". ").map((sentence, index) => (
                  <div key={index} className="my-2">
                    <span>{sentence.trim()}</span>
                    <br />
                  </div>
                ))}
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-center mb-8 px-4 md:px-16 lg:px-52">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-4 border rounded-lg"
              placeholder="Agregar un comentario..."
            />
            <Button
              variant={"default"}
              onClick={handleAddComment}
              className="mt-4 bg-green-600 hover:bg-green-800 py-2 px-6 rounded-lg"
            >
              Enviar
            </Button>
          </div>

          <div className="w-full flex flex-col items-center justify-center px-4 md:px-16 lg:px-52">
            {comments.map((comment) => {
              const user = getUserById(comment.usuario_id as string);
              return (
                <div
                  key={comment.id}
                  className="w-full bg-white shadow rounded-lg p-4 my-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="items-center flex">
                      {user?.avatar /* eslint-disable-next-line */ ? (
                        <img
                          src={user?.avatar || "/default-avatar.png"}
                          alt={user?.username || "Anónimo"}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                      ) : (
                        <UserCircleIcon className="w-12 h-12 mr-4" />
                      )}

                      <h4 className="text-lg font-semibold">
                        {user?.username || "Anónimo"}
                      </h4>
                    </div>
                    <div className="flex items-end justify-start flex-col">
                      <p className="text-gray-500 text-right text-xs md:text-base">
                        {new Date(
                          comment.publish_date.seconds * 1000
                        ).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-500">{comment.likes} </span>
                        <HeartIcon
                          onClick={() =>
                            handleToggleLike(comment.id, comment.likes)
                          }
                          className={`h-6 w-6 hover:cursor-pointer ${
                            JSON.parse(
                              localStorage.getItem("likes") || "[]"
                            ).some((item: string) => item === comment.id)
                              ? "text-red-500"
                              : "text-black"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700">{comment.contenido}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EditServiceForm
          setEditMode={setEditMode}
          service={service}
          setService={setService}
        />
      )}
    </div>
  );
};

export default Page;

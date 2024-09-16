"use client";
import React, { useEffect, useRef, useState } from "react";
import { News } from "@/interfaces/News.interface";
import { Comment } from "@/interfaces/Comments.interface";
import { User } from "@/interfaces/User.interface";
import { serviceGetNewsById } from "@/services/news.service";
import { serviceGetAllUsers } from "@/services/users.service";
import {
  serviceGetComments,
  serviceAddComment,
  serviceToggleLike,
} from "@/services/comments.service";
import LoadingSpinner from "@/shared/LoadingSpinner/LoadingSpinner";
import { HeartIcon } from "@heroicons/react/24/solid";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useAuthContext } from "@/Context/AuthContext";
import EditNewsForm from "./EditNewsForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Page = ({ params }: any) => {
  const [news, setNews] = useState<News | null>(null);
  const { authUser } = useAuthContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const { toast } = useToast();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const responseNews = await serviceGetNewsById(`${params.slug}`);
        const responseComments = await serviceGetComments(
          "noticia",
          `${params.slug}`
        );
        const responseUsers = await serviceGetAllUsers();

        if (responseNews) setNews(responseNews);
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

  const getUserById = (id: string) => users.find((user) => user.id === id);

  const handleAddComment = async () => {
    const comment: Omit<Comment, "id"> = {
      contenido: newComment,
      likes: 0,
      publish_date: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
      usuario_id: authUser ? authUser.id : "",
      noticia_id: params?.slug || "",
    };

    await serviceAddComment(comment);
    setNewComment("");
    const updatedComments = await serviceGetComments(
      "noticia",
      `${params.slug}`
    );
    const sortedComments = updatedComments.sort((a, b) => b.likes - a.likes);
    setComments(sortedComments);
  };
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
      "noticia",
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
        <div className="w-full flex flex-col px-8 md:px-16 lg:px-52">
          <div className="w-full flex my-10 flex-col items-center justify-center">
            {(authUser?.rol === "admin" || authUser?.rol === "personal") && (
              <Button
                variant={"default"}
                onClick={() => {
                  setEditMode(true);
                }}
                className={`bg-green-700 hover:bg-green-800 text-white flex self-end text-2xl p-3 items-center justify-center rounded-lg ${
                  isPast ? "top-10 md:right-24 lg:right-12 fixed" : ""
                }`}
              >
                Editar noticia
              </Button>
            )}
            <p className="text-gray-500 text-end w-full my-5">
              {news &&
                new Date(news.publish_date.seconds * 1000).toLocaleDateString(
                  "es-ES",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
            </p>
            {/* eslint-disable-next-line */}
            <img className="rounded-xl" src={news?.imagen} alt={news?.titulo} />
            <h2 className="text-4xl text-center my-8 font-extrabold text-gray-800 leading-tight">
              {news && news.titulo}
            </h2>
            <p className="text-lg font-medium text-justify text-gray-700 mt-4 px-4 lg:px-8">
              {news &&
                news.contenido.split(". ").map((sentence, index) => (
                  <div key={index} className="my-2">
                    <span>{sentence.trim()}</span>
                    <br />
                  </div>
                ))}
            </p>
          </div>
          <div className="w-full flex flex-col items-center justify-center mb-8 lg:px-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-4 border rounded-lg"
              placeholder="Agregar un comentario..."
            />
            <button
              onClick={handleAddComment}
              className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg"
            >
              Enviar
            </button>
          </div>

          <div className="w-full flex flex-col items-center justify-center lg:px-8">
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
                      <p className="text-gray-500 text-xs md:text-base text-right">
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
                          className={`h-6 w-6 ${
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
        <EditNewsForm
          setEditMode={setEditMode}
          noticia={news}
          setNoticia={setNews}
        />
      )}
    </div>
  );
};

export default Page;

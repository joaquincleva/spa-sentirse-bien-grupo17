"use client";
import Link from "next/link";

import BackgroundImage from "@/../public/background.jpg";
import { UserAuthForm } from "./UserLoginForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/Context/AuthContext";

export default function CreateAccountPage() {
  const { authUser } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (authUser) {
        router.push("/");
      }
    }, 1000);

    return () => clearTimeout(timer);
    //eslint-disable-next-line
  }, [authUser]);
  return (
    <>
      <div className="container overflow-x-hidden relative animate-translate-to-right h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 ">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Iniciar sesión
              </h1>
              <p className="text-sm text-muted-foreground">
                Inicia sesión para explorar eventos y espectáculos.
              </p>
            </div>
            <UserAuthForm />
            <p className="px-4  text-sm text-muted-foreground">
              ¿Todavía no estás registrado?
              <Link
                href="/auth/register"
                className="text-primary font-light underline ml-2"
              >
                Crea una cuenta
              </Link>
            </p>
          </div>
        </div>

        <div
          className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r"
          style={{
            backgroundImage: `url(${BackgroundImage.src})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    </>
  );
}

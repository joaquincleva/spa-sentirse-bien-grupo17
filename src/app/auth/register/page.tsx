"use client"
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import BackgroundImage from "@/../public/background.jpg";
import UserCreateAccountForm from "./createAccountForm";
import { useEffect } from "react";
import { useAuthContext } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";

export default function CreateAccountPage() {

  const {authUser} = useAuthContext()
  const router = useRouter()
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
    <div className="overflow-x-hidden">
      <div className="container relative animate-translate-to-left h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div
          className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r"
          style={{
            backgroundImage: `url(${BackgroundImage.src})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Crear Cuenta
              </h1>
              <p className="text-sm text-muted-foreground">
                Registrate para aprovechar todos los beneficios
              </p>
            </div>
            <UserCreateAccountForm />
            <p className="px-4  text-sm text-muted-foreground text-center">
              ¿Ya estás registrado?
              <Link href="/auth/login" className="text-primary ml-2">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

     
      </div>
    </div>
  );
}

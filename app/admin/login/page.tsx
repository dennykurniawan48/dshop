"use client";
import { StatusLoading } from "@/app/utils/enum/StatusLoading";
import { useFormik } from "formik";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { ReactElement, useEffect, useState } from "react";
import * as Yup from "yup";

function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [statusLogin, setStatusLogin] = useState<StatusLoading>(
    StatusLoading.Idle
  );
  const [errorMessage, setErrorMessage] = useState("");
  const loginSchema = Yup.object({
    email: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });
  const login = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      if (statusLogin == StatusLoading.Loading) {
        // do nothing on loading to login
        return;
      }
      setStatusLogin(StatusLoading.Loading);
      try {
        const user = await signIn("credentials",
          {...values,callbackUrl:"/admin"}
        );
      } catch (e) {
        setStatusLogin(StatusLoading.Error);
        setErrorMessage("Wrong credentials");
      }
    },
    validationSchema: loginSchema,
  });

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.is_admin) {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    }
  }, [session]);
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form
        method="POST"
        onSubmit={login.handleSubmit}
        className=" w-96 border border-gray-400 rounded-xl p-4 flex flex-col justify-center space-y-4"
      >
        <span className="w-full text-center text-lg font-bold">Login</span>
        <input
          type="text"
          name="email"
          id="email"
          onBlur={login.handleBlur}
          onChange={login.handleChange}
          value={login.values.email}
          className="w-full outline-none border border-gray-300 rounded-md px-3 py-1"
          placeholder="username"
        />
        <input
          type="password"
          name="password"
          id="password"
          onBlur={login.handleBlur}
          onChange={login.handleChange}
          value={login.values.password}
          className="w-full outline-none border border-gray-300 rounded-md px-3 py-1"
          placeholder="password"
        />
        <span className="text-red-500">{errorMessage}</span>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 w-32 bg-purple-500 text-white"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Page;

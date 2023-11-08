import Link from "next/link";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";
import { prisma } from "../utils/prisma";

async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  if (!searchParams.order) {
    notFound();
  }

  const data = await prisma.order.findUnique({
    where: { id: searchParams.order as string },
  });

  if (!data) {
    notFound();
  }

  return (
    <div className="h-screen w-full flex flex-col space-y-8 justify-center items-center">
      <img src="/thanks.svg" className="w-48 h-48" />
      <span className="text-xl font-bold">Thanks for choosing us</span>
      <div className="flex space-x-8">
        <Link
          href="/"
          className="px-4 py-2 bg-purple-500 text-white rounded-sm"
        >
          Back Home
        </Link>
        <Link href={`order/${searchParams.order}`} className="px-4 py-2 bg-purple-500 text-white rounded-sm">
          See Order
        </Link>
      </div>
    </div>
  );
}

export default Page;

'use client'
import React, { useEffect } from "react";
import Table from "./table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

async function Page() {
  const router = useRouter()
  const { data: session, status } = useSession();
   useEffect(() => {
    console.log(session)
      if(status === 'unauthenticated'){
        router.replace("/admin/login")
      }else if(status === "authenticated" && !session?.user?.is_admin){
        router.replace("/admin/login")
      }
   }, [session, status])
  return (
    <div className="px-6 w-full">
      <Table/>
    </div>
  );
}

export default Page;

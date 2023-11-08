'use client'
import React, { useEffect, useState } from 'react'
import { Chart, registerables } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Top = {name: string,qty:number}

async function Page() {
  const router = useRouter()
   const [topProduct, setTopProduct] = useState<Top[]>([])
   const [topUser, setTopUser] = useState<Top[]>([])
   const { data: session, status } = useSession();
  //  useEffect(() => {
  //     if(status === 'unauthenticated'){
  //       router.replace("/admin/login")
  //     }else if(status === "authenticated" && !session?.user.is_admin){
  //       router.replace("/admin/login")
  //     }
  //  }, [session, status])

   useEffect(() => {
      fetch('/api/top').then(res => {
        if(res.ok){
          return res.json()
        }
      }).then(res => {
        setTopProduct(res.data.product)
        setTopUser(res.data.user)
      }).catch(err => console.log(err))
   }, [])

Chart.register(...registerables);
const data = {
  labels: topProduct.map(it => it.name),
  datasets: [
    {
      label: 'Top 5 Product',
      data: topProduct.map(it => it.qty),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};


const columns: TableColumn<Top>[] = [
  {
    name: "Name",
    selector: (row) => row.name,
  },
  {
    name: "Total",
    selector: (row) => row.qty,
  }
];

  return (
    <div className='flex flex-col space-y-8 w-full p-4'>
      <div className='flex space-x-6'>
      <div className='w-1/3'>
      {<Pie data={data}/>}
      </div>
      <div className='w-2/3'>
      {<Bar data={data}/>}
      </div>
      </div>
      <div className='flex space-x-6'>
      <div className='w-1/2'>
      <DataTable
        columns={columns}
        data={topUser}
        subHeader
        className="w-full"
      />
      </div>
      <div className='w-1/2'>
      <DataTable
        columns={columns}
        data={topProduct}
        subHeader
        className="w-full"
      />
      </div>
      </div>
    </div>
  )
}

export default Page
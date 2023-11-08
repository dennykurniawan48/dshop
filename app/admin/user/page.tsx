import { prisma } from '@/app/utils/prisma'
import React from 'react'
import Table from './table'

async function Page() {
    const data = await prisma.user.findMany({select: {email: true, name: true}})
  return (
    <Table data={data}/>
  )
}

export default Page
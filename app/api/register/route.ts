import { prisma } from '@/app/utils/prisma';
import { randomUUID } from 'crypto';
import * as Yup from 'yup'

const bcrypt = require("bcryptjs")

export async function POST(req: Request) {
  const registerSchema = Yup.object({
    email: Yup.string().email("Invalid email address.").required("required"),
    firstname: Yup.string().min(3).required("required"),
    lastname: Yup.string().min(3).required("required"),
    password: Yup.string().min(5).required("required"),
    confirmpass: Yup.string()
      .min(5)
      .required("required")
      .oneOf([Yup.ref("password")], "Password don't match"),
  });
  
  try {
    const data = await registerSchema.validate(await req.json())
    const exist = await prisma.user.findUnique({ where: { email: data.email } })
    if (exist) {
      return new Response(JSON.stringify({ "error": "User exist" }), {
        status: 409,
      })
    } else {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: bcrypt.hashSync(data.password, 8),
          name: data.firstname + " " + data.lastname,
          accounts: {
            create: {
              type: "credentials",
              provider: "credentials",
              providerAccountId: randomUUID()
            }
          }
        }
      })
      const { password, ...rest } = user
      return Response.json({ "data": rest })
    }
  } catch (e) {
    return new Response(JSON.stringify({ "error": "Validation error" }), {
      status: 405,
    })
  }
}
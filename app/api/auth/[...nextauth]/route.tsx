import { prisma } from "@/app/utils/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { Account, AuthOptions, Profile, Session, SessionStrategy, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { error } from "console";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@domain.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findUnique({where:{email: credentials?.email}})
       
        if(user){
          const match = bcrypt.compareSync(credentials?.password, user.password)
          if(match){
            return user
          }
        }

        // Return null if user data could not be retrieved
        throw error("Wrong password")
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt(params:{ token: JWT, account: Account, user: User}) {
      // Persist the OAuth access_token and or the user id to the token right after signin
     
      return params.token
    },
    async session(params: { session: Session, token: JWT }): Promise<Session> {
      params.session.user = params.token
      return params.session
    },
    async redirect(params: { url: string, baseUrl: string }) {
      if(params.url.includes('/admin')){
        return "/admin"  
      }
      return "/"
    }
  },
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 60 * 60 * 24 * 30,
  },
  jwt: {
    async encode(params: {
      token: JWT;
      secret: string;
      maxAge: number;
    }): Promise<string> {
      // return a custom encoded JWT string
      const user = await prisma.user.findUnique({where:{email: params.token.email!}})
      return jwt.sign(
        {
          name: params.token.name,
          sub: params.token.sub,
          email: params.token.email,
          picture: params.token.picture,
          is_admin: user?.isAdmin,
          exp: Math.floor(Date.now() / 1000) + params.maxAge,
          id: user?.id
        },
        params.secret
      );
     },
    async decode(params: {
      token: string;
      secret: string;
    }): Promise<JWT | null> {
      // return a `JWT` object, or `null` if decoding failed
      return new Promise((resolve, reject) => {
        try {
          const decoded = jwt.verify(params.token, params.secret);
          resolve(decoded);
        } catch (err) {
          console.log(err)
          resolve(null);
        }
      });
    },
  },
};

const handler = NextAuth(authOptions as AuthOptions);

export { handler as GET, handler as POST };

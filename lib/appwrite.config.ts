// src/lib/server/appwrite.js
"use server";

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";
const { NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT } = process.env;

export async function createSessionClient() {
  const client = new Client().setEndpoint(NEXT_PUBLIC_APPWRITE_ENDPOINT!).setProject(NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = cookies().get("appwrite-session");
  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client().setEndpoint(NEXT_PUBLIC_APPWRITE_ENDPOINT!).setProject(NEXT_PUBLIC_APPWRITE_PROJECT!).setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get user() {
      return new Users(client);
    },
  };
}

// pass auf cache auf und mache es auf no cache

import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  console.log("Session in Frontend:", session);

  return <div>welcome, {session?.user?.username}</div>;
}

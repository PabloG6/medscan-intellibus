import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { getDB, createChat, getChat, getChatMessages } from "@intellibus/db";
import type { DiagnosisChatMessage } from "@/components/chat/types";
import { dbMessageToDiagnosisMessage } from "@/lib/chat/transformers";
import { DashboardClient } from "./dashboard-client";

interface DashboardPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function DashboardPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  const requestedChatId = searchParams?.chatId;
  const headerList = await headers();
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: Object.fromEntries(headerList.entries()),
  });

  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const db = await getDB();

  let chat = requestedChatId
    ? await getChat(db, requestedChatId, session.user.id)
    : null;

  if (!chat) {
    chat = await createChat(db, {
      userId: session.user.id,
    });
    redirect(`/dashboard?chatId=${chat.id}`);
  }

  const dbMessages = await getChatMessages(db, chat.id, session.user.id);
  const initialMessages: DiagnosisChatMessage[] = dbMessages.map(dbMessageToDiagnosisMessage);

  return <DashboardClient chatId={chat.id} initialMessages={initialMessages} />;
}

export type NoticeType = "error" | "success" | "info";

export type Notice = {
  type: NoticeType;
  message: string;
};

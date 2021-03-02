import HTTP from "http"

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type RequestCallback <State extends Record<string, unknown> = {}> = (props: {
  req: HTTP.IncomingMessage
  res: HTTP.ServerResponse
  state: State
  next (): ReturnType<RequestCallback> 
}) => Promise<void> | void

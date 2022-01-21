
export interface ExternalDevice {
  onlineUser: string,
  offlineUser: string,
  onlineUsers: Set<string>,
  wordWhizIsConnected: boolean
}

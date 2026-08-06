import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/ws',
  path: '/ws',
})
export class WsGateway implements OnGatewayConnection {
  private readonly logger = new Logger(WsGateway.name);

  @WebSocketServer()
  server!: Server;

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      await client.join(`user:${userId}`);
      this.logger.log(`WS Client connected: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`WS Client disconnected: ${client.id}`);
  }

  emitToUser<T>(userId: string, event: string, payload: T): void {
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}

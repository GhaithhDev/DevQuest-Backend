import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ListItemResponse } from './list-item.response';

@WebSocketGateway({ cors: { origin: '*' } })
export class ListGateway implements OnGatewayConnection {
    @WebSocketServer()
    server!: Server;

    constructor(private jwtService: JwtService) {}

    handleConnection(client: Socket) {
        try {
            const token = (client.handshake.auth?.token as string)?.replace('Bearer ', '');
            if (!token) throw new Error();
            const payload = this.jwtService.verify<{ robloxId: string }>(token);
            client.join(`list:${payload.robloxId}`);
        } catch {
            client.disconnect();
        }
    }

    emitItemAdded(robloxId: string, item: ListItemResponse) {
        this.server.to(`list:${robloxId}`).emit('list:item-added', item);
    }

    emitItemRemoved(robloxId: string, id: string) {
        this.server.to(`list:${robloxId}`).emit('list:item-removed', { id });
    }
}

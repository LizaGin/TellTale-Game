import {Server} from 'next';
import {DefaultQuery} from 'next/router';

declare global {
    namespace Express {
        interface Request {
            nextApp: Server;
        }

        interface Response {
            renderPage(pathname: string, query?: DefaultQuery): void;
        }
    }
}

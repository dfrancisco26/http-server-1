import chalk from 'chalk';
import net from 'net';

const logPrefix = (...args) => {
    if(process.env['NODE_ENV'] !== 'test') {
    console.log(chalk.green('[SERVER]'), ...args);
    }
}
const logErr = (...args) => {
    if(process.env['NODE_ENV'] !== 'test') {
    console.log(chalk.red('[SERVER]'), ...args);
    }
}
export const serve = (host, port) => {
    const server = net.createServer((socket) => {
        logPrefix('Connected to server');
        socket.on('data', (data) => {
            const dataStr = data.toString()
            logPrefix('Received data', dataStr);
            const lines = dataStr.split('\n')
            const startline = lines[0];
            const [method, path] = startline.split(' ');
            if (method === 'GET' && path === '/') {
                const body = `<html><main><h1>Hello, I'm GETting something here!</h1></main></html>`;
                socket.write(`HTTP/1.1 200 OK
                Content-Type: text/html
                Content-Length: ${body.length}

${body}`);
            } else if(method == 'GET' && path == '/posts') {
                const obj = {
                    name: 'Test Name',
                    word: 'Angler',
                }
                socket.write(`HTTP/1.1 200 OK
                Content-Length: ${JSON.toString(obj).length}
                Content-Type: application/json

${JSON.toString(obj)}`)
            }
        });
        socket.on('close', () => {
            logPrefix('Connection closed');
        });
        socket.on('error', (err) => {
            logErr('Error with socket', err);
        })
    });
    // const port = 8080;
    // const host = 'localhost';
    server.listen(port, host, () => {
        logPrefix(`Established server on ${host}:${port}!`);
      });
      logPrefix(`Listening to ${host}:${port}...`)
      return server;
};

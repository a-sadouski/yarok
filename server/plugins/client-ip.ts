import { forwardClientIp } from '../utils/client-ip';

export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('request', event => {
    if (event.path.startsWith('/api/')) {
      forwardClientIp(event.node.req.headers, event.node.req.socket?.remoteAddress);
    }
  });
});

class WebsocketService {
  constructor() {
    this.websocketServer = null;
    this.reconnectInterval = null;
    this.statusUpdateHandler = () => {};
  }

  initialize = () => {
    this.websocketServer = new WebSocket(
      window.location.origin.replace(/^http/, "ws")
    );
  
    this.websocketServer.onopen = () => { 
      clearInterval(this.reconnectInterval);
      console.log('connected!');
    }
  
    this.websocketServer.onclose = () => {
      clearInterval(this.reconnectInterval);
      this.reconnect();
    }
  
    this.websocketServer.onerror = () => {
      console.log('error!');
      this.websocketServer.close();
    }

    this.websocketServer.onmessage = (message) => {
      this.statusUpdateHandler(message);
    }
  }

  reconnect = () => {
    this.reconnectInterval = setInterval(() => {
      console.log('reconnecting...');
      this.initialize();
    }, 1000);
  }

  addStatusUpdateHandler = (callback) => {
    this.statusUpdateHandler = callback;
    this.websocketServer.onmessage = (message) => {
      this.statusUpdateHandler(message);
    }
  }
}

const WebsocketManager = new WebsocketService();

export { WebsocketManager };

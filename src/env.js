// src/config/env.js
const env = {
    SELF: import.meta.env.SELF ||  "beeep",
    API_URL: import.meta.env.API_URL ||  "bloop",
    STORAGE_URL: import.meta.env.STORAGE_URL  || "bloorp",
    WEBSOCKET_URL: import.meta.env.WEBSOCKET_URL || "blump",
  };
  
  export default env;
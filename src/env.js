// src/config/env.js
const env = {
    SELF:  import.meta.env.SELF ||import.meta.env.VITE_SELF || "beeep",
    API_URL:  import.meta.env.API_URL || import.meta.env.VITE_API_URL || "bloop",
    STORAGE_URL: import.meta.env.STORAGE_URL || import.meta.env.VITE_STORAGE_URL ||  "bloorp",
    WEBSOCKET_URL: import.meta.env.WEBSOCKET_URL || import.meta.env.VITE_WEBSOCKET_URL || "blump",
};

console.log(import.meta.env)

export default env;
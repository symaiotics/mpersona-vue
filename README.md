
# mPersona - By Symaiotics
mPersona is a Cloud-based and downloadable tool to build and interact with custom personas.
It facilitates much better interaction with Large Language Model services like Open AI's GPT4.

## About
mPersona is built in 2 parts, a Vue.js web interface (this package) and a Node.js server side application.

## Configuration
The application also requires environment variables to operate when run locally.
- VITE_API_URL=http://localhost:3000
- VITE_WEBSOCKET_URL=ws://localhost:3000
- VITE_STORAGE_URL=https://[AzureStorageAccount].blob.core.windows.net
When building the Vue project for deployment, replace these variables with real values for your API/Websocket endpoint(s) and your own Azure Storage Account.
GitHub Actions make this easy to implement.

## mPersona License Agreement

This software is provided "as is," without warranty of any kind, express or implied. In no event shall the author be held liable for any damages arising from the use of the software.

1. Definitions:
   "Organization" refers to a legal entity, excluding individuals.

2. Grant of License:
   Subject to the terms and conditions of this License, Symaiotics Corporation grants to you a non-exclusive, non-transferable license to use the software.

3. Restrictions:
   - You may not use this software for commercial purposes if you are part of an Organization with more than 100 people.
   - You may not distribute, sublicense, lease, rent, sell, or otherwise transfer the software or any of its components to any third party.
   - You may not modify, decompile, disassemble, or reverse engineer the software.

4. Termination:
   This License is effective until terminated. Your rights under this License will terminate automatically without notice from Symaiotics Corporation if you fail to comply with any term(s) of this License.

5. Governing Law:
   This License will be governed by and construed in accordance with the laws of Ontario, Canada, excluding its conflict of law principles.

6. Miscellaneous:
   If any provision of this License is held to be unenforceable, that provision will be removed, and the remaining provisions will remain in full force.

END OF LICENSE

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```


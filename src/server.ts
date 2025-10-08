import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

// Carpeta donde está la build del navegador
const browserDistFolder = join(import.meta.dirname, '../browser');

// Crear aplicación Express
const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Ejemplo de endpoints REST de Express
 * Descomenta y define según sea necesario
 *
 * app.get('/api/{*splat}', (req, res) => {
 *   // manejar la petición API
 * });
 */

/**
 * Servir archivos estáticos desde la carpeta /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * Manejar todas las demás rutas renderizando la aplicación Angular
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

/**
 * Iniciar el servidor si este módulo es el principal
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) throw error;
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Handler de peticiones usado por Angular CLI o Firebase Functions
 */
export const reqHandler = createNodeRequestHandler(app);

import auth from './auth';
import emisores from './emisores';
import receptores from './receptores';
import catalogos from './catalogos'; // Nueva ruta
import admin from './admin'; // Ruta de seed

export const apiRoutes = {
  auth,
  emisores,
  receptores,
  catalogos,
  admin
};
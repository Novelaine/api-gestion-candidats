/* Si fichier.env */
require('dotenv').config();
/* Si frontend à part 
app.use(cors({
  origin: 'http://localhost:5173'
}));
*/
const express = require('express');
const cors = require('cors');

const app = express();
/* On  crée une instance serveur */

app.use(express.json());

const candidatsRoutes = require('./src/routes/candidats.routes');
const postesRoutes = require('./src/routes/postes.routes');

app.use('/candidats', candidatsRoutes);
app.use('/postes', postesRoutes);
app.use("/uploads", express.static("uploads"));
app.use(cors());

const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend')));

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});

import path, { dirname } from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

//to use module type instead of commonjs, in package.json, we have to add type:"module"

const app = express();

//we cannot directly use __dirname in module type, we must follow this way:
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});

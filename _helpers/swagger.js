import express from 'express';
const router = express.Router();
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger.yaml');

router.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export default router;

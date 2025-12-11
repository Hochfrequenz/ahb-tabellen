import { Router, IRouter } from 'express';
import AHBController from '../controller/ahb';
import AhbDiffController from '../controller/ahbDiff';
import FormatVersionController from '../controller/formatVersion';
import FormateController from '../controller/formate';
import HealthController from '../controller/health';
import SearchController from '../controller/search';
import RichtungController from '../controller/richtung';

const router: IRouter = Router();

const ahbController = new AHBController();
const ahbDiffController = new AhbDiffController();
const formatVersionController = new FormatVersionController();
const formateController = new FormateController();
const healthController = new HealthController();
const searchController = new SearchController();
const richtungController = new RichtungController();

router.get('/health', async (req, res, next) => {
  await healthController.check(req, res).catch((err: Error) => next(err));
});

router.get('/ahb/:formatVersion/:pruefi', (req, res, next) => {
  ahbController.get(req, res, next);
});

router.get('/ahb-diff/:pruefi', (req, res, next) => {
  ahbDiffController.get(req, res, next);
});

router.post('/search/query', (req, res, next) => {
  searchController.query(req, res, next);
});

router.get('/format-versions', async (req, res, next) => {
  await formatVersionController.list(req, res).catch((err: Error) => next(err));
});

router.get('/formate', async (req, res, next) => {
  await formateController.list(req, res).catch((err: Error) => next(err));
});

router.get('/direction-values', async (req, res, next) => {
  await richtungController.list(req, res).catch((err: Error) => next(err));
});

router.get('/pruefidentifikatoren/:formatVersion', async (req, res, next) => {
  await formatVersionController
    .listPruefisByFormatVersion(req, res)
    .catch((err: Error) => next(err));
});

router.all('/**', (req, res) => {
  res.status(404);
  res.send({ message: 'not found' });
});

export default router;

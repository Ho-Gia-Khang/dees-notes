import express from "express";
import { getDocumentsList } from "./controllers";

const router = express.Router();

router.get("/", getDocumentsList);

export default router;

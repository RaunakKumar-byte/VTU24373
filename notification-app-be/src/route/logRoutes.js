import { Router } from "express";
import axios from "axios";
import { config } from "../config/env.js";
import { getAuthorizationHeader } from "../auth/tokenService.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const auth = await getAuthorizationHeader();
    const { data } = await axios.post(`${config.evaluationBase}/logs`, req.body, {
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 8000,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;

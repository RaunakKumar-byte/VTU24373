import { Router } from "express";
import { getAuthorizationHeader } from "../auth/tokenService.js";

const router = Router();

router.get("/test", async (req, res, next) => {
  try {
    const token = await getAuthorizationHeader();
    res.json({
      ok: true,
      tokenPreview: `${token.slice(0, 20)}...`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

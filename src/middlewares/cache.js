const cache = (req, res, next) => {
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "max-age=60, stale-while-revalidate=120");
    // res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
  }
  next();
};

export { cache };

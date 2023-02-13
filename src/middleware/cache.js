const cache = (cacheDur, swrDur) => {
  return (_req, res, next) => {
    res.setHeader(
      "Cache-Control",
      `max-age=0, s-maxage=${cacheDur}, stale-while-revalidate=${swrDur}`
    );
    next();
  };
};

export { cache };

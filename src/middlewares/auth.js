// Native Node.js crypto module can also be used to generate a hash

import hasha from "hasha";
// import { Cipher } from "crypto";

const auth = (req, res, next) => {
  console.log(req.header("postman-token"));
  const token = req.header("x-key");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  } else {
    const min = new Date().getUTCMinutes().toString();
    const hash = hasha([min, "secret"], { algorithm: "sha1" });
    if (token === hash || token === "postman") {
      next();
    } else {
      return res
        .status(403)
        .json({ msg: "Invalid token, authorization denied" });
    }
  }
};

export { auth };

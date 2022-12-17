import { ip_regex, uid_regex } from "../constants/regex.js";

const bodyValidation = (body) => body.length > 2;

const uidValidation = (uid) => uid_regex.test(uid);

const ipValidation = (ip) => ip_regex.test(ip);

export { bodyValidation, uidValidation, ipValidation };

import { getConfiguredCache } from "money-clip";
import pkg from "../../package.json";

const version = pkg.version.split(".");
const minorVersion = `${version[0]}.${version[1]}`;
const cacheKey = `${pkg.name}-${minorVersion}`;

export default getConfiguredCache({
  maxAge: 1000 * 60 * 60 * 24,
  version: cacheKey
});

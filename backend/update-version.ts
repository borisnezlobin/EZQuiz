import { writeFileSync } from "fs";
import path from "path";
import { getOrWriteVersion } from "./version";

const data = getOrWriteVersion();

const major = parseInt(data.split(".")[0]);
const minor = parseInt(data.split(".")[1]);
const patch = parseInt(data.split(".")[2]);

writeFileSync(
  path.join(__dirname, "./version.txt"),
  `${major}.${minor}.${patch + 1}`,
);
console.log(`Updated version to ${major}.${minor}.${patch + 1}!`);

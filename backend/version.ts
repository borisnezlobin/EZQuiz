import { readFileSync, writeFileSync } from "fs";
import path from "path";

const versionPath = path.join(__dirname, "version.txt");

function getOrWriteVersion() {
  let data: string;
  try {
    data = readFileSync(versionPath, "utf8");
  } catch (err) {
    console.log("Error reading file version.txt");
    console.error(err);
    if (err.code === "ENOENT") {
      writeFileSync(versionPath, "1.0.0");
      console.error("Creating version.txt with version 1.0.0");
    }
    data = "1.0.0";
  }
  return data;
}

const verifyVersion = (version: string) => {
  if (!version.match(/\d+\.\d+\.\d+/)) {
    throw new Error(`Invalid version: ${version}`);
  }
};

const data = getOrWriteVersion();
verifyVersion(data);
const major = parseInt(data.split(".")[0]);
const minor = parseInt(data.split(".")[1]);
const patch = parseInt(data.split(".")[2]);

// writeFileSync("version.txt", `${major}.${minor}.${patch + 1}`);
// console.log(`Updated version to ${major}.${minor}.${patch + 1}!`);

export const version = `${major}.${minor}.${patch}`;
export { getOrWriteVersion };

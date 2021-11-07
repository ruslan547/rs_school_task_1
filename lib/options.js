import { ArgvError } from "./app-err.js";
import { capitalizeFirstLetter } from "./common.js";
import path from "path";
import fs from "fs";

export class Options {
  argv;
  input;
  output;
  ciphers = [];

  constructor(argv) {
    this.argv = argv;
    this.parceArgv();
  }

  static parce(argv) {
    return new Options(argv);
  }

  parcePath(pathArg, type) {
    const typeNameCap = capitalizeFirstLetter(type);

    if (!["input", "output"].includes(type)) {
      throw new ArgvError("Incorrect argument type");
    }
    if (!pathArg) {
      throw new ArgvError(`${typeNameCap} path is missing`);
    }
    if (this[type]) {
      throw new ArgvError(`${typeNameCap} can be defined only once`);
    }

    const resolvedPath = path.isAbsolute(pathArg)
      ? pathArg
      : path.join(process.cwd(), pathArg);

    if (!fs.existsSync(resolvedPath)) {
      throw new ArgvError(
        `${typeNameCap} file by path "${resolvedPath}" doesn't exist`
      );
    }

    try {
      fs.accessSync(
        resolvedPath,
        type === "input"
          ? fs.constants.R_OK
          : fs.constants.R_OK | fs.constants.W_OK
      );
    } catch (err) {
      throw new ArgvError(
        `${typeNameCap} access forbidden for file by path "${resolvedPath}"`
      );
    }

    this[type] = resolvedPath;
  }

  parceCiphers(ciphersArg) {
    const ciphersRaw = ciphersArg.split("-");

    if (ciphersRaw.length === 0) {
      throw new ArgvError("Ciphers not defined");
    }

    for (const raw of ciphersRaw) {
      if (!["C1", "C0", "R1", "R0", "A"].includes(raw)) {
        throw new ArgvError(`Unknown cipher "${raw}""`);
      }

      const cipher = {};

      if (raw === "A") {
        cipher.type = "Atbash";
      } else {
        cipher.type = raw[0] === "C" ? "Caesar" : "ROT";
        cipher.shift = raw[0] === "C" ? 1 : 8;
        cipher.action = raw[1] === "1" ? "encode" : "decode";
      }

      this.ciphers.push(cipher);
    }
  }

  parceArgv() {
    for (let idx = 0; idx < this.argv.length; idx++) {
      const arg = this.argv[idx];

      // get and skip following value
      const val = this.argv[idx + 1];
      idx++;

      switch (arg) {
        case "-c":
        case "--config": {
          if (!val) {
            throw new ArgvError("Config ciphers is missing");
          }
          if (this.ciphers.length !== 0) {
            throw new ArgvError("Config ciphers duplicate argument");
          }
          this.parceCiphers(val);

          break;
        }

        case "-i":
        case "--input": {
          this.parcePath(val, "input");
          break;
        }

        case "-o":
        case "--output": {
          this.parcePath(val, "output");
          break;
        }

        default:
          throw new ArgvError(`Unknown argument "${this.argv[idx]}"`);
      }
    }

    if (this.ciphers.length === 0) {
      throw new ArgvError("Config ciphers is missing");
    }
  }
}

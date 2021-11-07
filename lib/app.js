import { Options } from "./options.js";
import { AppErr } from "./app-err.js";
import { Cipher } from "./cipher.js";
import { pipeline } from "stream/promises";
import {
  ReadStream,
  WriteStream,
  CipherTransformStream,
} from "./transforms.js";

export class App {
  static async exec(argv) {
    try {
      const options = Options.parce(argv);
      const ciphers = Cipher.generateCiphers(options);

      const transforms = [];
      for (const cipher of ciphers) {
        const transform = new CipherTransformStream(cipher);

        transforms.push(transform);
      }

      await pipeline(
        options.input ? new ReadStream(options.input) : process.stdin,
        ...transforms,
        options.output ? new WriteStream(options.output) : process.stdout
      );
    } catch (err) {
      if (err instanceof AppErr) {
        console.error(`Error: ${err.name}. ${err.message}`);
      } else {
        console.error(err);
      }

      process.exit(1);
    }
  }
}

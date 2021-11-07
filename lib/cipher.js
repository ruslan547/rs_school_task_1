export class Cipher {
  decodeAlphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  encodeAlphabet;

  options;
  encode;

  constructor(options) {
    this.options = options;

    this.encode =
      options.type === "Atbash" ? true : options.action === "encode";

    this.generateEncodeAlphabet();
  }

  static generateCiphers(options) {
    const ciphers = [];

    for (const cipherOpt of options.ciphers) {
      ciphers.push(new Cipher(cipherOpt));
    }

    return ciphers;
  }

  generateEncodeAlphabet() {
    if (this.options.type === "Atbash") {
      this.encodeAlphabet = this.decodeAlphabet.slice().reverse();
    } else {
      this.encodeAlphabet = this.decodeAlphabet.map((_, idx) => {
        let decodeCharIdx =
          (idx + this.options.shift) % this.decodeAlphabet.length;

        if (decodeCharIdx < 0) {
          decodeCharIdx += this.decodeAlphabet.length;
        }

        return this.decodeAlphabet[decodeCharIdx];
      });
    }
  }

  processChar(char) {
    const upperCaseChar = char.toUpperCase();

    const charIdx =
      this[this.encode ? "decodeAlphabet" : "encodeAlphabet"].indexOf(
        upperCaseChar
      );
    if (charIdx === -1) {
      return char;
    }

    let result =
      this[this.encode ? "encodeAlphabet" : "decodeAlphabet"][charIdx];

    if (upperCaseChar !== char) {
      result = result.toLowerCase();
    }

    return result;
  }

  process(text) {
    let result = "";

    for (const char of text) {
      result += this.processChar(char);
    }

    return result;
  }
}

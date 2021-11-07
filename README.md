# The Rolling Scopes School. Task 1. Ciphering CLI tool

## Implementation

Completed all [tasks](https://github.com/rolling-scopes-school/basic-nodejs-course/blob/master/cross-check/ciphering-cli-tool.md), including advanced implementation.

## Run

To run use `node cip` and pass the flags

For example:

```sh
node cip -c "C1-C1-R0-A" -i "./input.txt" -o "./output.txt"
```

```sh
node cip -c "C1-C1-R0-A"
```

## Flags

1.  **-c, --config**: config for ciphers
    Config is a string with pattern `{XY(-)}n`, where:

- `X` is a cipher mark:
  - `C` is for Caesar cipher (with shift 1)
  - `A` is for Atbash cipher
  - `R` is for ROT-8 cipher
- `Y` is flag of encoding or decoding (mandatory for Caesar cipher and ROT-8 cipher and should not be passed Atbash cipher)
  - `1` is for encoding
  - `0` is for decoding

2.  **-i, --input**: a path to input file
3.  **-o, --output**: a path to output file

For example, running:

```sh
node cip -c "C1-C1-R0-A" -i "./input.txt" -o "./output.txt"
```

means "encode by Caesar cipher => encode by Caesar cipher => decode by ROT-8 => use Atbash" from `"./input.txt"` to `"./output.txt"`

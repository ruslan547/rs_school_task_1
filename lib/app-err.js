export class AppErr extends Error {
  name;
  level;

  constructor(message, opt) {
    super(message);
    this.type = opt?.level || "fatal";
    this.name = opt?.name || "Application error";
  }
}

export class ArgvError extends AppErr {
  constructor(message, opt) {
    super(message, { name: "Arguments error", ...opt });
  }
}

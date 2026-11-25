// Optional bindings: the current site does not provision a database.
declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
  }
}

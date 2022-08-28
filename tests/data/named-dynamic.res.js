const out = {
  "./bye.ts": () => import("./bye.ts").then(m => m.hello),
  "./asdf/hello.ts": () => import("./asdf/hello.ts").then(m => m.hello)
};
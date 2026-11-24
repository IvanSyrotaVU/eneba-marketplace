import { spawn } from "node:child_process";
import net from "node:net";

const isPortOpen = (port) =>
  new Promise((resolve) => {
    const s = net.createConnection({ port, host: "127.0.0.1" });
    s.once("connect", () => { s.destroy(); resolve(true); });
    s.once("error", () => resolve(false));
  });

let phpProc = null;
if (!(await isPortOpen(8000))) {
  console.log("Starting PHP + MySQL API server on http://localhost:8000 ...");
  phpProc = spawn("php", ["-S", "localhost:8000", "-t", "../backend/public"], {
    stdio: "inherit",
    shell: true,
  });
}

const viteProc = spawn("npx", ["vite"], { stdio: "inherit", shell: true });
const cleanup = () => {
  if (phpProc) phpProc.kill();
  viteProc.kill();
  process.exit();
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
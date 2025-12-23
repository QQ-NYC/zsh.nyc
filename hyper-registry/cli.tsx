import { Command } from "commander";
import { render } from "ink";
import { HyperRegistryApp } from "./hyper-registry";

const program = new Command();
program
  .name("hyper")
  .version("1.0.0")
  .option("-v, --verbose")
  .command("registry <action>")
  .description("Control registry operations")
  .action(async (action) => {
    // e.g., registry create/read/update/delete...
  });
program.parse(process.argv);

// TUI example
render(<HyperRegistryApp />);
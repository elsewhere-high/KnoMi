import { tmpdir } from "node:os";
import { join } from "node:path";

process.env.KNOMI_DATA_DIR = join(tmpdir(), `knomi-vitest-${process.pid}`);

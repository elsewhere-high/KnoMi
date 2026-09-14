import { existsSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectEnvironment = fileURLToPath(new URL("../../../../.conda-env", import.meta.url));

/** Select Python only from a Conda environment; never fall back to system PATH. */
export function resolveCondaPython(
	env: NodeJS.ProcessEnv = process.env,
	localEnvironment = projectEnvironment,
): string | null {
	const executable = process.platform === "win32" ? "python.exe" : "bin/python";
	const candidates = [
		env.KNOMI_PYTHON?.trim(),
		env.CONDA_PREFIX ? join(env.CONDA_PREFIX, executable) : undefined,
		join(localEnvironment, executable),
	];
	for (const candidate of candidates) {
		if (!candidate) continue;
		const absolute = resolve(candidate);
		const directory = dirname(absolute);
		const prefix = basename(directory) === "bin" ? dirname(directory) : directory;
		if (existsSync(absolute) && existsSync(join(prefix, "conda-meta"))) return absolute;
	}
	return null;
}

import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { resolveCondaPython } from "./python-runtime.js";

const roots: string[] = [];
afterEach(() => roots.splice(0).forEach(root => rmSync(root, { recursive: true, force: true })));
function environment(conda: boolean) {
	const root = mkdtempSync(join(tmpdir(), "knomi-python-"));
	roots.push(root);
	if (conda) mkdirSync(join(root, "conda-meta"));
	mkdirSync(join(root, "bin"));
	const python = join(root, process.platform === "win32" ? "python.exe" : "bin/python");
	writeFileSync(python, "");
	return { root, python };
}

describe("Conda Python selection", () => {
	it("prefers an explicit Conda executable over the active environment", () => {
		const explicit = environment(true);
		const active = environment(true);
		expect(resolveCondaPython({ KNOMI_PYTHON: explicit.python, CONDA_PREFIX: active.root }, active.root)).toBe(explicit.python);
	});
	it("rejects a Python installation without Conda metadata", () => {
		const plain = environment(false);
		expect(resolveCondaPython({ KNOMI_PYTHON: plain.python, PATH: plain.root }, plain.root)).toBeNull();
	});
	it("finds the local project environment without shell activation", () => {
		const local = environment(true);
		expect(resolveCondaPython({}, local.root)).toBe(local.python);
	});
});

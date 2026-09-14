import { describe, expect, it } from "vitest";
import { expandKnoMiSlashCommand, KNOMI_SLASH_COMMAND_NAMES } from "./knomi-extension.js";

describe("expandKnoMiSlashCommand", () => {
	it("returns null for non-command text", () => {
		expect(expandKnoMiSlashCommand("hello")).toBeNull();
		expect(expandKnoMiSlashCommand("")).toBeNull();
	});

	it("returns null for commands KnoMi does not own (skills, plugin commands)", () => {
		expect(expandKnoMiSlashCommand("/skill:ppt-creation make slides")).toBeNull();
		expect(expandKnoMiSlashCommand("/todos")).toBeNull();
		expect(expandKnoMiSlashCommand("/model")).toBeNull();
	});

	it("expands /recall with a query into an l3_recall instruction", () => {
		const expanded = expandKnoMiSlashCommand("/recall 链式法则我上次卡在哪？");
		expect(expanded).toContain("l3_recall");
		expect(expanded).toContain("链式法则我上次卡在哪？");
	});

	it("expands a bare /recall into a default review request", () => {
		const expanded = expandKnoMiSlashCommand("/recall");
		expect(expanded).toContain("l3_recall");
		expect(expanded).not.toBeNull();
	});

	it("expands /remember with a fact into an L1 write instruction", () => {
		const expanded = expandKnoMiSlashCommand("/remember 我更喜欢用例子学概念");
		expect(expanded).toContain("学习者画像");
		expect(expanded).toContain("我更喜欢用例子学概念");
	});

	it("expands /wiki with a query into an l2_query instruction", () => {
		const expanded = expandKnoMiSlashCommand("/wiki 贝叶斯定理的笔记在哪？");
		expect(expanded).toContain("l2_query");
		expect(expanded).toContain("贝叶斯定理的笔记在哪？");
	});

	it("expands a bare /wiki into an index overview request", () => {
		const expanded = expandKnoMiSlashCommand("/wiki");
		expect(expanded).toContain("l2_query");
		expect(expanded).toContain("索引");
	});

	it("trims extra whitespace around args", () => {
		const expanded = expandKnoMiSlashCommand("/recall   微积分  ");
		expect(expanded).toContain("微积分");
		expect(expanded).not.toContain("  微积分");
	});

	it("registers exactly the expandable commands", () => {
		expect([...KNOMI_SLASH_COMMAND_NAMES].sort()).toEqual(["recall", "remember", "wiki"]);
	});
});

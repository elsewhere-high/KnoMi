import { apiFetch } from "./client.js";
import type { KnoMiSettings, SmartInputSettings, UpsertProviderRequest, ChannelsSettingsPayload, WindowCloseBehavior, WebAccessSettings, WebAccessSettingsPayload, PermissionPolicyMode } from "../types/settings.js";

export async function getSettings(): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>("/api/settings");
}

export async function switchBackendModel(provider: string, model: string): Promise<Pick<KnoMiSettings, "defaultProvider" | "defaultModel">> {
	return apiFetch<Pick<KnoMiSettings, "defaultProvider" | "defaultModel">>("/api/settings/model", {
		method: "POST",
		body: JSON.stringify({ provider, model }),
	});
}

export async function upsertProvider(payload: UpsertProviderRequest): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>("/api/settings/providers", {
		method: "PUT",
		body: JSON.stringify(payload),
	});
}

export async function deleteProviderApi(providerId: string): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>(`/api/settings/providers/${encodeURIComponent(providerId)}`, {
		method: "DELETE",
	});
}

export async function deleteModelApi(providerId: string, modelId: string): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>(
		`/api/settings/providers/${encodeURIComponent(providerId)}/models/${encodeURIComponent(modelId)}`,
		{ method: "DELETE" },
	);
}

export interface ProbeModelsRequest {
	baseUrl: string;
	apiKey?: string;
	providerId?: string;
	api?: string;
}

export async function probeProviderModels(payload: ProbeModelsRequest): Promise<{ models: string[] }> {
	return apiFetch<{ models: string[] }>("/api/settings/providers/probe-models", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function saveChannelsSettings(payload: ChannelsSettingsPayload): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>("/api/settings/channels", {
		method: "PUT",
		body: JSON.stringify(payload),
	});
}

export interface MemorySettingsPatch {
	l1Enabled?: boolean;
	l2Enabled?: boolean;
	l3Enabled?: boolean;
}

export async function saveMemorySettings(patch: MemorySettingsPatch): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>("/api/settings/memory", {
		method: "PUT",
		body: JSON.stringify(patch),
	});
}

export async function savePermissionMode(mode: PermissionPolicyMode): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>("/api/settings/permissions", {
		method: "PUT",
		body: JSON.stringify({ mode }),
	});
}

export async function saveSmartInputSettings(payload: SmartInputSettings): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>("/api/settings/smart-input", {
		method: "PUT",
		body: JSON.stringify(payload),
	});
}

export async function saveMcpSettings(enabled: boolean): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>("/api/settings/mcp", {
		method: "PUT",
		body: JSON.stringify({ enabled }),
	});
}

export async function saveGithubSettings(token: string): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>("/api/settings/github", {
		method: "PUT",
		body: JSON.stringify({ token }),
	});
}

export interface OcrSettingsPayload {
	token: string;
	model?: string;
	baseUrl?: string;
}

export async function saveOcrSettings(payload: OcrSettingsPayload): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>("/api/settings/ocr", {
		method: "PUT",
		body: JSON.stringify(payload),
	});
}

export async function saveTavilySettings(apiKey: string): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>("/api/settings/tavily", {
		method: "PUT",
		body: JSON.stringify({ apiKey }),
	});
}

export async function getWebAccessSettings(): Promise<WebAccessSettings> {
	return apiFetch<WebAccessSettings>("/api/settings/web-access");
}

export async function saveWebAccessSettings(payload: WebAccessSettingsPayload): Promise<WebAccessSettings> {
	return apiFetch<WebAccessSettings>("/api/settings/web-access", {
		method: "PUT",
		body: JSON.stringify(payload),
	});
}

export interface ContentHubPayload {
	type: "github" | "bundle";
	owner?: string;
	repo?: string;
	ref?: string;
	skillsPath?: string;
	presetsPath?: string;
	baseUrl?: string;
	token?: string;
}

export async function saveContentHubSettings(payload: ContentHubPayload): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>("/api/settings/content-hub", {
		method: "PUT",
		body: JSON.stringify(payload),
	});
}

export async function saveThemeSettings(theme: string): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>("/api/settings/theme", {
		method: "PUT",
		body: JSON.stringify({ theme }),
	});
}

export async function saveCloseBehavior(closeBehavior: WindowCloseBehavior): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>("/api/settings/close-behavior", {
		method: "PUT",
		body: JSON.stringify({ closeBehavior }),
	});
}

export async function saveMarkdownSettings(mathSingleDollar: boolean): Promise<KnoMiSettings> {
	return apiFetch<KnoMiSettings>("/api/settings/markdown", {
		method: "PUT",
		body: JSON.stringify({ mathSingleDollar }),
	});
}

export async function feishuQrRegister(): Promise<{ deviceCode: string; qrUrl: string; expiresIn: number; interval: number }> {
	return apiFetch<{ deviceCode: string; qrUrl: string; expiresIn: number; interval: number }>("/api/channels/feishu/qr-register", {
		method: "POST",
	});
}

export async function feishuQrStatus(deviceCode: string): Promise<{ status: string }> {
	return apiFetch<{ status: string }>(`/api/channels/feishu/qr-status?deviceCode=${encodeURIComponent(deviceCode)}`);
}

export async function wechatQrLogin(): Promise<{ qrId: string; qrUrl: string }> {
	return apiFetch<{ qrId: string; qrUrl: string }>("/api/channels/wechat/qr-login", {
		method: "POST",
	});
}

export async function wechatQrStatus(qrId: string): Promise<{ status: string; botId?: string }> {
	return apiFetch<{ status: string; botId?: string }>(`/api/channels/wechat/qr-status?qrId=${encodeURIComponent(qrId)}`);
}

export async function wechatStatus(): Promise<{ configured: boolean; connected: boolean; botId?: string; loggedIn?: boolean }> {
	return apiFetch<{ configured: boolean; connected: boolean; botId?: string; loggedIn?: boolean }>("/api/channels/wechat/status");
}

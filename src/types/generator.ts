// ── Scene Detail ──────────────────────────────────────────────────────────

export type SceneDetail = {
  scene_number: number;
  time_range: string;
  visual_prompt: string;
  voiceover: string;
  voice_style: string;
};

// ── API Response (discriminated union) ────────────────────────────────────

export type GenerateResponse =
  | { mode: "creative"; script: string }
  | { mode: "guided"; title: string; total_duration: string; scenes: SceneDetail[] };

// ── Request Payloads ─────────────────────────────────────────────────────

export type GuidedPayload = {
  mode: "guided";
  platform: string;
  tone: string;
  topic: string;
};

export type CreativePayload = {
  mode: "creative";
  topic: string;
};

export type GenerateScriptPayload = GuidedPayload | CreativePayload;
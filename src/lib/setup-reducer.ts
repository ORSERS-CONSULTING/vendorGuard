"use client";

import options from "./data.json";

// ---------- Types ----------
export type Identifier = { key: string; value: string };

export type SetupState = {
  business: { tenantType: string; industry: string };
  compliance: Identifier[];
  location: {
    address: string;
    city: string;
    postal: string;
    timezone: string;
    currency: string;
  };
  branding: { website: string; logoFile?: File | null; logoPreview?: string };
  verification: Record<string, File | null>;
  agree: boolean;
};

export type Action =
  | { type: "business"; field: keyof SetupState["business"]; value: string }
  | { type: "compliance:add" }
  | { type: "compliance:update"; index: number; field: keyof Identifier; value: string }
  | { type: "compliance:remove"; index: number }
  | { type: "location"; field: keyof SetupState["location"]; value: string }
  | { type: "branding:web"; value: string }
  | { type: "branding:logo"; file: File | null; preview?: string }
  | { type: "verification"; doc: string; file: File | null }
  | { type: "agree"; value: boolean }
  | { type: "reset" };

// ---------- Initial State ----------
const verificationInit: Record<string, File | null> =
  options.verificationDocs.reduce((acc: Record<string, File | null>, name: string) => {
    acc[name] = null;
    return acc;
  }, {});

export const initialState: SetupState = {
  business: { tenantType: "", industry: "" },
  compliance: [{ key: "License Number", value: "" }],
  location: {
    address: "",
    city: "",
    postal: "",
    timezone: "",
    currency: options.currencies[0] ?? "AED",
  },
  branding: { website: "", logoFile: null, logoPreview: undefined },
  verification: verificationInit,
  agree: false,
};

// ---------- Reducer ----------
export function setupReducer(state: SetupState, action: Action): SetupState {
  switch (action.type) {
    case "business":
      return { ...state, business: { ...state.business, [action.field]: action.value } };
    case "compliance:add":
      return { ...state, compliance: [...state.compliance, { key: "", value: "" }] };
    case "compliance:update": {
      const next = state.compliance.map((row, i) =>
        i === action.index ? { ...row, [action.field]: action.value } : row
      );
      return { ...state, compliance: next };
    }
    case "compliance:remove": {
      const next = state.compliance.filter((_, i) => i !== action.index);
      return { ...state, compliance: next.length ? next : [{ key: "", value: "" }] };
    }
    case "location":
      return { ...state, location: { ...state.location, [action.field]: action.value } };
    case "branding:web":
      return { ...state, branding: { ...state.branding, website: action.value } };
    case "branding:logo":
      return { ...state, branding: { ...state.branding, logoFile: action.file, logoPreview: action.preview } };
    case "verification":
      return { ...state, verification: { ...state.verification, [action.doc]: action.file } };
    case "agree":
      return { ...state, agree: action.value };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

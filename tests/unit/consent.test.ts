// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";
import { CONSENT_REGIONS, GTAG_INIT, openPrivacyChoices, watchPrivacyChoice, type PrivacyChoice } from "@/lib/consent";

type FcWindow = Window & { googlefc?: unknown; __tcfapi?: unknown };

const US = { UNKNOWN: 0, DOES_NOT_APPLY: 1, NOT_OPTED_OUT: 2, OPTED_OUT: 3 };

// Google's queue runs each { KEY: fn } once its consent tool is ready; the stub runs them at once.
function stubGoogle({ usStatus, gdprApplies }: { usStatus?: number; gdprApplies?: boolean }) {
  const fc = {
    callbackQueue: { push: (cb: Record<string, () => void>) => Object.values(cb).forEach(fn => fn()) },
    showRevocationMessage: vi.fn(),
    usstatesoptout: usStatus === undefined ? undefined : {
      InitialUsStatesOptOutStatusEnum: US,
      getInitialUsStatesOptOutStatus: () => usStatus,
      openConfirmationDialog: vi.fn(),
    },
  };
  const w = window as FcWindow;
  w.googlefc = fc;
  if (gdprApplies !== undefined) {
    w.__tcfapi = (_cmd: string, _v: number, cb: (d: { gdprApplies: boolean }, ok: boolean) => void) => cb({ gdprApplies }, true);
  }
  return fc;
}

function choicesFor(opts: { usStatus?: number; gdprApplies?: boolean }) {
  stubGoogle(opts);
  const seen: PrivacyChoice[] = [];
  watchPrivacyChoice(c => seen.push(c));
  return seen;
}

afterEach(() => {
  delete (window as FcWindow).googlefc;
  delete (window as FcWindow).__tcfapi;
});

describe("consent mode defaults", () => {
  test("cover the EEA, the UK and Switzerland", () => {
    expect(CONSENT_REGIONS).toHaveLength(32);
    expect(CONSENT_REGIONS).toEqual(expect.arrayContaining(["GB", "CH", "NO", "DE"]));
  });

  test("are set before Analytics is configured", () => {
    const consent = GTAG_INIT.indexOf("'consent','default'");
    expect(consent).toBeGreaterThan(-1);
    expect(consent).toBeLessThan(GTAG_INIT.indexOf("'config'"));
  });
});

describe("watchPrivacyChoice", () => {
  test("queues its callbacks before Google's tool loads, which runs them later", () => {
    const seen: PrivacyChoice[] = [];
    watchPrivacyChoice(c => seen.push(c));
    expect(((window as FcWindow).googlefc as { callbackQueue: unknown[] }).callbackQueue).toHaveLength(2);
    expect(seen).toEqual([]);
  });

  test("finds the US dialog in a US state with a privacy law", () => {
    expect(choicesFor({ usStatus: US.NOT_OPTED_OUT, gdprApplies: false })).toEqual(["us"]);
    expect(choicesFor({ usStatus: US.OPTED_OUT })).toEqual(["us"]);
  });

  test("finds the European message where EU rules apply", () => {
    expect(choicesFor({ usStatus: US.DOES_NOT_APPLY, gdprApplies: true })).toEqual(["eu"]);
  });

  test("finds nothing where neither applies, or while the US status is unknown", () => {
    expect(choicesFor({ usStatus: US.DOES_NOT_APPLY, gdprApplies: false })).toEqual([]);
    expect(choicesFor({ usStatus: US.UNKNOWN, gdprApplies: false })).toEqual([]);
    expect(choicesFor({})).toEqual([]);
  });
});

describe("openPrivacyChoices", () => {
  test("opens the US opt-out dialog", () => {
    const fc = stubGoogle({ usStatus: US.NOT_OPTED_OUT });
    openPrivacyChoices("us");
    expect(fc.usstatesoptout!.openConfirmationDialog).toHaveBeenCalledTimes(1);
    expect(fc.showRevocationMessage).not.toHaveBeenCalled();
  });

  test("reopens the European consent message", () => {
    const fc = stubGoogle({ usStatus: US.DOES_NOT_APPLY });
    openPrivacyChoices("eu");
    expect(fc.showRevocationMessage).toHaveBeenCalledTimes(1);
    expect(fc.usstatesoptout!.openConfirmationDialog).not.toHaveBeenCalled();
  });
});

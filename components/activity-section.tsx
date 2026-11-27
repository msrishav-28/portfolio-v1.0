import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";
import CommitBonsai, {
  type Contribution,
} from "@/components/ui/commit-bonsai";

const USERNAME = "msrishav-28";
const CONTRIBUTIONS_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;
const LEVEL_COLORS = [
  "#151515",
  "rgba(6, 213, 147, 0.22)",
  "rgba(6, 213, 147, 0.4)",
  "rgba(6, 213, 147, 0.65)",
  "rgb(6, 213, 147)",
];

type GithubContribution = Contribution & { level?: number };
type View = "heatmap" | "bonsai";

function isGithubContribution(value: unknown): value is GithubContribution {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(record.date) &&
    !Number.isNaN(Date.parse(`${record.date}T00:00:00Z`)) &&
    new Date(`${record.date}T00:00:00Z`).toISOString().slice(0, 10) ===
      record.date &&
    Number.isInteger(record.count) &&
    typeof record.count === "number" &&
    record.count >= 0 &&
    (record.level === undefined ||
      (Number.isInteger(record.level) &&
        typeof record.level === "number" &&
        record.level >= 0 &&
        record.level <= 4))
  );
}

function getContributionRecords(payload: unknown): GithubContribution[] {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("The contribution service returned an invalid response.");
  }
  const records = (payload as { contributions?: unknown }).contributions;
  if (
    !Array.isArray(records) ||
    records.length === 0 ||
    !records.every(isGithubContribution)
  ) {
    throw new Error("The contribution service returned invalid daily data.");
  }
  return records.slice().sort((a, b) => a.date.localeCompare(b.date));
}

function getLevel(contribution: GithubContribution | undefined) {
  if (!contribution || contribution.count === 0) return 0;
  if (contribution.level !== undefined) return contribution.level;
  if (contribution.count >= 10) return 4;
  if (contribution.count >= 6) return 3;
  if (contribution.count >= 3) return 2;
  return 1;
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function Heatmap({ contributions }: { contributions: GithubContribution[] }) {
  const { weeks, monthLabels } = useMemo(() => {
    const byDate = new Map(contributions.map((item) => [item.date, item]));
    const first = new Date(`${contributions[0].date}T00:00:00`);
    const last = new Date(
      `${contributions[contributions.length - 1].date}T00:00:00`,
    );
    const start = new Date(first);
    start.setDate(start.getDate() - start.getDay());
    const dayCount =
      Math.ceil((last.getTime() - start.getTime()) / 864e5) + 1;
    const weekCount = Math.ceil(dayCount / 7);
    const weeks = Array.from({ length: weekCount }, (_, weekIndex) =>
      Array.from({ length: 7 }, (_, dayIndex) => {
        const date = new Date(start);
        date.setDate(start.getDate() + weekIndex * 7 + dayIndex);
        return { date, contribution: byDate.get(formatDate(date)) };
      }),
    );
    const monthLabels = weeks.map((week) =>
      week.find((day) => day.date.getDate() === 1)?.date.toLocaleDateString(
        "en-US",
        { month: "short" },
      ),
    );
    return { weeks, monthLabels };
  }, [contributions]);

  const total = contributions.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="rounded-xl border border-[color:var(--activity-border)] bg-[#080808] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-[color:var(--activity-muted-foreground)]">
          <span className="font-mono text-white">
            {total.toLocaleString("en-US")}
          </span>{" "}
          contributions in the last year
        </p>
        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[color:var(--activity-muted-foreground)] underline decoration-white/20 underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--activity-ring)]"
        >
          @{USERNAME}
        </a>
      </div>
      <div
        className="overflow-x-auto pb-2"
        role="region"
        aria-label="Contribution calendar, scroll horizontally to explore"
        tabIndex={0}
      >
        <div className="min-w-[670px]">
          <div
            className="mb-1 grid gap-[3px] text-[9px] text-[color:var(--activity-muted-foreground)]"
            style={{ gridTemplateColumns: `repeat(${weeks.length}, 10px)` }}
            aria-hidden="true"
          >
            {monthLabels.map((month, index) => (
              <span key={index} className="whitespace-nowrap">
                {month}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <div
              className="grid shrink-0 grid-rows-7 gap-[3px] text-[9px] leading-[10px] text-[color:var(--activity-muted-foreground)]"
              aria-hidden="true"
            >
              <span />
              <span>Mon</span>
              <span />
              <span>Wed</span>
              <span />
              <span>Fri</span>
              <span />
            </div>
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="flex flex-col gap-[3px]"
                  role="group"
                  aria-label={`Week ${weekIndex + 1}`}
                >
                  {week.map(({ date, contribution }) => {
                    const count = contribution?.count ?? 0;
                    const level = getLevel(contribution);
                    return (
                      <span
                        key={formatDate(date)}
                        title={`${count} contribution${count === 1 ? "" : "s"} on ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                        aria-label={`${count} contribution${count === 1 ? "" : "s"} on ${formatDate(date)}`}
                        className="size-[10px] rounded-[2px] outline-offset-1"
                        style={{
                          backgroundColor: LEVEL_COLORS[level],
                          outlineColor: "var(--activity-ring)",
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-[color:var(--activity-muted-foreground)]">
        <span>Less</span>
        {LEVEL_COLORS.map((color, index) => (
          <span
            key={index}
            className="size-[10px] rounded-[2px]"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

export default function ActivitySection() {
  const [contributions, setContributions] = useState<GithubContribution[]>();
  const [error, setError] = useState<string>();
  const [view, setView] = useState<View>("heatmap");
  const [retry, setRetry] = useState(0);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let nextView: View | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextView = view === "heatmap" ? "bonsai" : "heatmap";
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextView = view === "bonsai" ? "heatmap" : "bonsai";
    } else if (event.key === "Home") {
      nextView = "heatmap";
    } else if (event.key === "End") {
      nextView = "bonsai";
    }

    if (nextView) {
      event.preventDefault();
      setView(nextView);
      document.getElementById(`activity-tab-${nextView}`)?.focus();
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let didTimeout = false;
    const timeout = window.setTimeout(() => {
      didTimeout = true;
      controller.abort();
    }, 15000);
    setContributions(undefined);
    setError(undefined);

    async function loadContributions() {
      try {
        const response = await fetch(CONTRIBUTIONS_URL, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(
            `Contribution data could not be loaded (HTTP ${response.status}).`,
          );
        }
        const records = getContributionRecords(
          (await response.json()) as unknown,
        );
        if (!controller.signal.aborted) setContributions(records);
      } catch (reason) {
        if (controller.signal.aborted && !didTimeout) return;
        setError(
          didTimeout
            ? "Loading contribution data timed out. Please try again."
            : reason instanceof Error
            ? reason.message
            : "Contribution data could not be loaded.",
        );
      }
    }

    void loadContributions();
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [retry]);

  return (
    <section id="activity-section">
      <div className="activity-container">
        <div className="title-section">
          <div className="title">
            <h2 className="left">Contribution activity</h2>
            <div className="right">Last 12 months</div>
          </div>
          <div className="desc">
            A year of work, in a GitHub calendar or grown into a bonsai.
          </div>
        </div>

        <div className="activity-card">
          <div
            className="inline-flex rounded-full border border-[color:var(--activity-border)] bg-[#090909] p-1"
            role="tablist"
            aria-label="Contribution view"
          >
            <button
              id="activity-tab-heatmap"
              type="button"
              role="tab"
              aria-selected={view === "heatmap"}
              aria-controls="activity-panel-heatmap"
              onClick={() => setView("heatmap")}
              onKeyDown={handleTabKeyDown}
              className={`rounded-full px-4 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--activity-ring)] ${
                view === "heatmap"
                  ? "bg-white text-black"
                  : "text-[color:var(--activity-muted-foreground)] hover:text-white"
              }`}
            >
              Heatmap
            </button>
            <button
              id="activity-tab-bonsai"
              type="button"
              role="tab"
              aria-selected={view === "bonsai"}
              aria-controls="activity-panel-bonsai"
              onClick={() => setView("bonsai")}
              onKeyDown={handleTabKeyDown}
              className={`rounded-full px-4 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--activity-ring)] ${
                view === "bonsai"
                  ? "bg-white text-black"
                  : "text-[color:var(--activity-muted-foreground)] hover:text-white"
              }`}
            >
              Bonsai
            </button>
          </div>

          <div
            id="activity-panel-heatmap"
            role="tabpanel"
            aria-labelledby="activity-tab-heatmap"
            hidden={view !== "heatmap"}
            className="mt-4"
            tabIndex={0}
          >
            {contributions && <Heatmap contributions={contributions} />}
          </div>
          <div
            id="activity-panel-bonsai"
            role="tabpanel"
            aria-labelledby="activity-tab-bonsai"
            hidden={view !== "bonsai"}
            className="mt-4"
            tabIndex={0}
          >
            {contributions && view === "bonsai" && (
              <CommitBonsai
                className="mx-auto border-[color:var(--activity-border)] bg-[#080808]"
                contributions={contributions}
                seed={USERNAME}
                label={`${USERNAME}'s contribution bonsai`}
              />
            )}
          </div>

          {!contributions && !error && (
            <p className="mt-4 rounded-xl border border-[color:var(--activity-border)] bg-[#080808] px-4 py-6 text-sm text-[color:var(--activity-muted-foreground)]">
              Loading GitHub contributions…
            </p>
          )}
          {error && (
            <div
              className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-[#100909] px-4 py-4 text-sm"
              role="alert"
            >
              <p className="text-[color:var(--activity-muted-foreground)]">
                {error}
              </p>
              <button
                type="button"
                onClick={() => setRetry((attempt) => attempt + 1)}
                className="rounded-md border border-[color:var(--activity-border)] px-3 py-1.5 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--activity-ring)]"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

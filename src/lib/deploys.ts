import "server-only";
import { APPS } from "./apps";
import type { DeploySource } from "./apps";

/** When each app was last deployed, as an ISO date, by its href */
export type Deploys = Record<string, string | null>;

const API = "https://api.github.com";
// GitHub allows 60 unauthenticated requests an hour; a refresh takes eight
const TTL = 15 * 60 * 1000;
// How many of the latest deployments to look through for one that succeeded
const DEPLOYMENTS = 3;

interface WorkflowRuns {
  workflow_runs: { updated_at: string }[];
}

interface Deployment {
  statuses_url: string;
}

interface DeploymentStatus {
  created_at: string;
  state: string;
}

const github = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "irmahs.dev",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub ${res.status} for ${url}`);
  }

  // SAFETY: GitHub's REST API answers these endpoints with the shapes above
  return (await res.json()) as T;
};

/** When the source's latest successful deploy finished, or null if it has none */
const lastDeploy = async (source: DeploySource) => {
  const repo = `${API}/repos/${source.repo}`;

  if ("workflow" in source) {
    const { workflow_runs: runs } = await github<WorkflowRuns>(
      `${repo}/actions/workflows/${source.workflow}/runs?status=success&per_page=1`
    );

    return runs[0]?.updated_at ?? null;
  }

  const deployments = await github<Deployment[]>(
    `${repo}/deployments?environment=${encodeURIComponent(source.environment)}&per_page=${DEPLOYMENTS}`
  );

  // Each deployment's statuses come newest first, so the first is its outcome
  const outcomes = await Promise.all(
    deployments.map(async ({ statuses_url: url }) => {
      const [status] = await github<DeploymentStatus[]>(`${url}?per_page=1`);

      return status;
    })
  );

  return (
    outcomes.find((status) => status?.state === "success")?.created_at ?? null
  );
};

let cache: { at: number; deploys: Promise<Deploys> } | null = null;

const refresh = async (previous: Deploys) => {
  const dates = await Promise.all(
    APPS.map(async (app) => {
      try {
        return await lastDeploy(app.deploys);
      } catch (error) {
        console.error(error);

        // Keep the date it had until GitHub answers again
        return previous[app.href] ?? null;
      }
    })
  );

  return Object.fromEntries(APPS.map((app, i) => [app.href, dates[i] ?? null]));
};

/** Every app's last deploy from GitHub, refreshed every 15 minutes */
export const getDeploys = async () => {
  if (!cache || Date.now() - cache.at > TTL) {
    // Set before awaiting, so visitors arriving meanwhile share this refresh
    const previous = cache?.deploys;
    cache = {
      at: Date.now(),
      deploys: (async () => await refresh((await previous) ?? {}))(),
    };
  }

  return await cache.deploys;
};

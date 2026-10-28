import "server-only";
import type { VisitorCountry, VisitorDay, VisitorHistory } from "./visitors";

const API = "https://api.cloudflare.com/client/v4/graphql";

// Cloudflare's numbers move slowly; asking every few minutes is plenty
const TTL = 5 * 60 * 1000;

const DAYS = 7;

/** The countries profile.txt lists */
export const TOP_COUNTRIES = 6;

// Zone Analytics by day: unique visitors (by IP) and page views, and each
// country's requests. Cloudflare has no unique visitors by country.
const QUERY = `query ($zone: string!, $since: Date!, $until: Date!) {
  viewer {
    zones(filter: { zoneTag: $zone }) {
      httpRequests1dGroups(
        limit: ${DAYS}
        filter: { date_geq: $since, date_leq: $until }
        orderBy: [date_ASC]
      ) {
        dimensions { date }
        uniq { uniques }
        sum {
          pageViews
          countryMap { clientCountryName requests }
        }
      }
    }
  }
}`;

interface DayGroup {
  dimensions: { date: string };
  sum: {
    countryMap: { clientCountryName: string; requests: number }[];
    pageViews: number;
  };
  uniq: { uniques: number };
}

interface GraphqlAnswer {
  data?: { viewer?: { zones?: { httpRequests1dGroups?: DayGroup[] }[] } };
  errors?: { message: string }[] | null;
}

/** The last seven ISO dates (UTC), oldest first, ending on today */
export const lastDays = (now = Date.now()) =>
  Array.from({ length: DAYS }, (_, i) =>
    new Date(now - (DAYS - 1 - i) * 86_400_000).toISOString().slice(0, 10)
  );

/**
 * Cloudflare's day groups as the week: every one of `dates`, with zeros for a
 * day it has nothing for, and the countries with the most requests across them.
 */
export const toHistory = (
  groups: DayGroup[],
  dates: string[]
): VisitorHistory => {
  const byDate = new Map(groups.map((g) => [g.dimensions.date, g]));

  const days: VisitorDay[] = dates.map((date) => {
    const group = byDate.get(date);

    return {
      date,
      pageViews: group?.sum.pageViews ?? 0,
      visitors: group?.uniq.uniques ?? 0,
    };
  });

  const requests = new Map<string, number>();

  for (const group of groups) {
    for (const { clientCountryName: code, requests: n } of group.sum
      .countryMap) {
      requests.set(code, (requests.get(code) ?? 0) + n);
    }
  }

  const total = [...requests.values()].reduce((a, b) => a + b, 0);

  const countries: VisitorCountry[] = [...requests]
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, TOP_COUNTRIES)
    .map(([code, n]) => ({ code, share: n / total }));

  return { countries, days };
};

const ask = async (token: string, zone: string, now: number) => {
  const dates = lastDays(now);

  const res = await fetch(API, {
    body: JSON.stringify({
      query: QUERY,
      variables: { since: dates[0], until: dates.at(-1), zone },
    }),
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(`Cloudflare ${res.status}`);
  }

  // SAFETY: Cloudflare's GraphQL API answers QUERY in the shape above
  const answer = (await res.json()) as GraphqlAnswer;

  if (answer.errors?.length) {
    throw new Error(`Cloudflare: ${answer.errors[0]?.message}`);
  }

  const groups = answer.data?.viewer?.zones?.[0]?.httpRequests1dGroups;

  if (!groups) {
    throw new Error("Cloudflare: no such zone");
  }

  return toHistory(groups, dates);
};

let cache: { at: number; history: Promise<VisitorHistory> } | null = null;

// A failed answer isn't kept: the next visit asks again
const askOrForget = async (token: string, zone: string, now: number) => {
  try {
    return await ask(token, zone, now);
  } catch (error) {
    cache = null;
    throw error;
  }
};

/**
 * The last seven days of visitors and their countries, from Cloudflare's
 * Analytics API, kept for five minutes. Null when CLOUDFLARE_API_TOKEN or
 * CLOUDFLARE_ZONE_ID isn't set.
 */
export const getVisitorHistory = (
  now = Date.now()
): Promise<VisitorHistory> | null => {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zone = process.env.CLOUDFLARE_ZONE_ID;

  if (!(token && zone)) {
    return null;
  }

  if (!cache || now - cache.at >= TTL) {
    cache = { at: now, history: askOrForget(token, zone, now) };
  }

  return cache.history;
};

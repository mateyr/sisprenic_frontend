import { useRouterState } from "@tanstack/react-router";
import { pages } from "@/lib/page-registry";

export type BreadcrumbSegment = {
  label: string;
  /** Fully resolved href (dynamic params substituted with actual values). */
  href: string;
  isLast: boolean;
};

/**
 * Try to match a URL pathname against a route pattern.
 *
 * Dynamic segments in the pattern start with "$" (e.g. "$clientId").
 * Returns the extracted params on success, or null on mismatch.
 */
function matchPattern(
  pattern: string,
  pathname: string,
): Record<string, string> | null {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const segment = patternParts[i];
    if (segment.startsWith("$")) {
      params[segment.slice(1)] = pathParts[i];
    } else if (segment !== pathParts[i]) {
      return null;
    }
  }

  return params;
}

/** Replace "$param" placeholders in a pattern with their resolved values. */
function resolvePattern(
  pattern: string,
  params: Record<string, string>,
): string {
  return pattern.replace(/\$(\w+)/g, (_, key) => params[key] ?? key);
}

// Pre-build a lookup map from path pattern → breadcrumb label.
// Only include entries that have a breadcrumb label defined.
// Patterns with fewer dynamic segments come first so that static routes
// (e.g. "/loans/new") are matched before dynamic ones (e.g. "/loans/$loanId").
const breadcrumbMap: Map<string, string> = new Map(
  [...pages]
    .filter((p) => p.breadcrumb !== undefined)
    .sort((a, b) => {
      const dynamicCount = (p: string) => (p.match(/\$/g) ?? []).length;
      return dynamicCount(a.path) - dynamicCount(b.path);
    })
    .map((p) => [p.path, p.breadcrumb!]),
);

/**
 * Returns the ordered list of breadcrumb segments for the current route.
 */
export function useBreadcrumbs(): BreadcrumbSegment[] {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const matchedPattern = [...breadcrumbMap.keys()].find(
    (p) => matchPattern(p, pathname) !== null,
  );

  if (!matchedPattern) return [];

  const params = matchPattern(matchedPattern, pathname)!;
  const patternParts = matchedPattern.split("/").filter(Boolean);
  const segments: BreadcrumbSegment[] = [];

  for (let i = 0; i < patternParts.length; i++) {
    const partialPattern = "/" + patternParts.slice(0, i + 1).join("/");
    const label = breadcrumbMap.get(partialPattern);
    if (!label) continue;

    segments.push({
      label,
      href: resolvePattern(partialPattern, params),
      isLast: false,
    });
  }

  if (segments.length > 0) {
    segments[segments.length - 1].isLast = true;
  }

  return segments;
}

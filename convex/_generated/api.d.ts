/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as callSessions from "../callSessions.js";
import type * as callSummaries from "../callSummaries.js";
import type * as commitmentLogs from "../commitmentLogs.js";
import type * as dailyPlans from "../dailyPlans.js";
import type * as debug from "../debug.js";
import type * as http from "../http.js";
import type * as schedules from "../schedules.js";
import type * as users from "../users.js";
import type * as visionProfiles from "../visionProfiles.js";
import type * as weeklyObjectives from "../weeklyObjectives.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  callSessions: typeof callSessions;
  callSummaries: typeof callSummaries;
  commitmentLogs: typeof commitmentLogs;
  dailyPlans: typeof dailyPlans;
  debug: typeof debug;
  http: typeof http;
  schedules: typeof schedules;
  users: typeof users;
  visionProfiles: typeof visionProfiles;
  weeklyObjectives: typeof weeklyObjectives;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agent from "../agent.js";
import type * as auth from "../auth.js";
import type * as callSessions from "../callSessions.js";
import type * as callSummaries from "../callSummaries.js";
import type * as calls from "../calls.js";
import type * as commitmentLogs from "../commitmentLogs.js";
import type * as dailyPlans from "../dailyPlans.js";
import type * as dashboard from "../dashboard.js";
import type * as debug from "../debug.js";
import type * as http from "../http.js";
import type * as schedules from "../schedules.js";
import type * as users from "../users.js";
import type * as vapi from "../vapi.js";
import type * as vapi_tools_daily from "../vapi/tools/daily.js";
import type * as vapi_tools_onboarding from "../vapi/tools/onboarding.js";
import type * as vapi_tools_utils from "../vapi/tools/utils.js";
import type * as vapi_tools_weekly from "../vapi/tools/weekly.js";
import type * as visionProfiles from "../visionProfiles.js";
import type * as weeklyObjectives from "../weeklyObjectives.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agent: typeof agent;
  auth: typeof auth;
  callSessions: typeof callSessions;
  callSummaries: typeof callSummaries;
  calls: typeof calls;
  commitmentLogs: typeof commitmentLogs;
  dailyPlans: typeof dailyPlans;
  dashboard: typeof dashboard;
  debug: typeof debug;
  http: typeof http;
  schedules: typeof schedules;
  users: typeof users;
  vapi: typeof vapi;
  "vapi/tools/daily": typeof vapi_tools_daily;
  "vapi/tools/onboarding": typeof vapi_tools_onboarding;
  "vapi/tools/utils": typeof vapi_tools_utils;
  "vapi/tools/weekly": typeof vapi_tools_weekly;
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

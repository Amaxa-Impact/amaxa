// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import {
  createSearchParamsCache,
  parseAsBoolean,
  parseAsIsoDateTime,
  parseAsString,
} from "nuqs/server";

export const searchParamsParser = {
  selectedDate: parseAsIsoDateTime.withDefault(new Date()),
  is24Hour: parseAsBoolean.withDefault(false),
  timezone: parseAsString.withDefault("America/New_York"),
};

export const searchParamsCache = createSearchParamsCache(searchParamsParser);

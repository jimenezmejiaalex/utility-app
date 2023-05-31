import { Currency } from "@prisma/client";

export const getSymbol = (currency: Currency) =>
    ({ [Currency.CRC]: "₡", [Currency.USD]: "$" }[currency])
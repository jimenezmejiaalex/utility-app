import { Currency } from '@prisma/client';
import * as CurrencyConverter from 'currency-converter-lt';

export class CurrencyService {

    async convert(from: Currency, to: Currency, amount: number) {
        const currencyConverter = new CurrencyConverter({ from, to, amount });
        return await currencyConverter.convert()
    }
}
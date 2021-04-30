import {IBrowser} from "../../Infrastructure";
import {CurrencyRate, ICurrencyRate} from "./CurrencyRate";
import {DependencyProvider} from '../../Infrastructure/DependencyInjection/DependencyInjector';

export interface IBackendApi {
    symbols(): Promise<Record<string, string>>

    rate(from: string, to: string): Promise<ICurrencyRate | null>
}

export class BackendApi implements IBackendApi {
    private readonly _rates: Record<string, Record<string, ICurrencyRate>>;
    private _symbols: Record<string, string> | undefined;
    private _symbolsExpireDate: number;
    private _browser: IBrowser;

    constructor({browser}: DependencyProvider) {
        this._symbolsExpireDate = 0;
        this._rates = {}
        this._symbols = undefined;
        this._browser = browser;
    }

    async symbols(forceUpdate: boolean = false): Promise<Record<string, string>> {
        const symbolsKey = `uacc:symbols`;
        const dateKey = `uacc:symbols:date`;

        this._symbolsExpireDate = this._symbolsExpireDate || (await this._browser.loadLocal<number>(dateKey));
        const diff = Date.now() - (this._symbolsExpireDate || 1);
        const isExpired: boolean = diff >= 1000 * 60 * 60 * 24 * 7

        if (!forceUpdate && !isExpired) {
            if (!this._symbols) this._symbols = await this._browser.loadLocal<Record<string, string>>(symbolsKey)
            return this._symbols;
        }

        this._symbols = await this._browser.background.getSymbols();
        this._symbolsExpireDate = Date.now();

        await Promise.all([
            this._browser.saveLocal(symbolsKey, this._symbols),
            this._browser.saveLocal(dateKey, this._symbolsExpireDate)
        ])

        return this._symbols;
    }

    async rate(from: string, to: string): Promise<ICurrencyRate | null> {
        if (from === to) return new CurrencyRate(from, to, 1, Date.now());

        const rateKey = `uacc:rate:${from}:${to}`;
        const dateKey = `uacc:rate:date:${from}:${to}`;

        if (!this._rates[from]) this._rates[from] = {}

        if (!this._rates[from][to]) {
            const [rate, date]: [number, number] = await Promise.all([
                this._browser.loadLocal<number>(rateKey),
                this._browser.loadLocal<number>(dateKey)])
            this._rates[from][to] = new CurrencyRate(from, to, rate, date || 0);
        }

        if (!this._rates[from][to].isExpired) return this._rates[from][to];

        const rate = await this._browser.background.getRate(from, to).then(e => e.rate);

        await Promise.all([
            this._browser.saveLocal(rateKey, rate),
            this._browser.saveLocal(dateKey, Date.now())])

        return (this._rates[from][to] = new CurrencyRate(from, to, rate, Date.now()))

    }
}
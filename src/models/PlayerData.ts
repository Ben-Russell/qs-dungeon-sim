export interface IPlayerInfoData {
    name: string;
    level: number;

    brawn: number;
    acumen: number;
    wisdom: number;
    precision: number;
}

export interface IPlayerCurrencyData {
    credits: number;
}

export interface IPlayerData {
    info: IPlayerInfoData;
    currency: IPlayerCurrencyData;
}
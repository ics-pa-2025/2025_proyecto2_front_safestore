import type {SellDetailDto} from "./sell-detail.dto.ts";

export class RequestSellDto {
    idComprador?: string;
    sellDetails: SellDetailDto[];

    constructor(idComprador: string, sellDetails: SellDetailDto[]) {
        this.idComprador = idComprador;
        this.sellDetails = sellDetails;
    }
}

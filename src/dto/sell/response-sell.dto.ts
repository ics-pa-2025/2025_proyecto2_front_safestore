import type {ResponseSellDetailDto} from "./response-sell-detail.dto.ts";

export class ResponseSellDto {
    id: number;
    total: string;
    createdAt: Date;
    idVendedor: string;
    idComprador: string | null;
    sellDetails: ResponseSellDetailDto[];

    constructor(id: number, total: string, createdAt: Date, idVendedor: string, idComprador: string | null, sellDetails: ResponseSellDetailDto[]) {
        this.id = id;
        this.total = total;
        this.createdAt = createdAt;
        this.idVendedor = idVendedor;
        this.idComprador = idComprador;
        this.sellDetails = sellDetails;
    }
}

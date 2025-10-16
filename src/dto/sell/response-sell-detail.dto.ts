export class ResponseSellDetailDto {
    id: number;
    cantidad: number;
    precioUnitario: string;

    constructor(id: number, cantidad: number, precioUnitario: string) {
        this.id = id;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }
}

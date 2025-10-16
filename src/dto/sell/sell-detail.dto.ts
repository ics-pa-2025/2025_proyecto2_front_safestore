export class SellDetailDto {
    cantidad: number;
    idProduct: number;

    constructor(cantidad: number, idProduct: number) {
        this.cantidad = cantidad;
        this.idProduct = idProduct;
    }
}

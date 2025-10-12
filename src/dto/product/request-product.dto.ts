export class RequestProductDto {
    name: string;
    description?: string;
    price: number;
    stock: number;
    brandId: number;
    lineId: number;

    constructor(
        name: string,
        price: number,
        stock: number,
        brandId: number,
        lineId: number,
        description?: string
    ) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.brandId = brandId;
        this.lineId = lineId;
    }
}

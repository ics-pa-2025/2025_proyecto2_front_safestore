export class RequestProductDto {
    name: string;
    description?: string;
    price: number;
    stock: number;
    brandId: number;
    lineId: number;
    imageUrl?: string;
    suppliers?: number[];

    constructor(
        name: string,
        price: number,
        stock: number,
        brandId: number,
        lineId: number,
        description?: string,
        imageUrl?: string,
        suppliers?: number[]
    ) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.brandId = brandId;
        this.lineId = lineId;
        this.imageUrl = imageUrl;
        this.suppliers = suppliers;
    }
}

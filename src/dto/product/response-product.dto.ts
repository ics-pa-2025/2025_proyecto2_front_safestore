import type { ResponseBrandDto } from '../brands/response-brand.dto.ts';
import type { ResponseLineDto } from '../line/response-line.dto.ts';
import type { ResponseSupplierDto } from '../supplier/response-supplier.dto.ts';

export class ResponseProductDto {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    brandId: number;
    lineId: number;
    imageUrl?: string;
    brand: ResponseBrandDto;
    line: ResponseLineDto;
    suppliers?: ResponseSupplierDto[];


    constructor(
        id: number,
        name: string,
        description: string,
        price: number,
        stock: number,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date,
        brandId: number,
        lineId: number,
        brand: ResponseBrandDto,
        line: ResponseLineDto,
        imageUrl?: string,
        suppliers?: ResponseSupplierDto[]
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.brandId = brandId;
        this.lineId = lineId;
        this.imageUrl = imageUrl;
        this.brand = brand;
        this.line = line;
        this.suppliers = suppliers;
    }
}

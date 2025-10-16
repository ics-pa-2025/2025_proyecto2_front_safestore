export class RequestSupplierDto {
    name: string;
    phone: string;
    email: string;
    isActive?: boolean;
    productIds?: number[];

    constructor(
        name: string,
        phone: string,
        email: string,
        isActive: boolean = true,
        productIds?: number[]
    ) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.isActive = isActive;
        this.productIds = productIds;
    }
}
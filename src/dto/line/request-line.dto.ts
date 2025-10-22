export class RequestLineDto {
    name: string;
    description?: string;
    isActive?: boolean;
    brandId: number;

    constructor(name: string,brandId: number, description?: string, isActive: boolean = true) {
        this.name = name;
        this.description = description;
        this.isActive = isActive;
        this.brandId = brandId;
    }
}

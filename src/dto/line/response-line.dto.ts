export class ResponseLineDto {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    brandId: number;

    constructor(
        id: number,
        name: string,
        description: string,
        isActive: boolean,
        brandId: number
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isActive = isActive;
        this.brandId = brandId;
    }
}

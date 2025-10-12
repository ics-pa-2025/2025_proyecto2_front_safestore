export class ResponseBrandDto {
    id: number;
    name: string;
    description: string;
    logo: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        name: string,
        description: string,
        logo: string,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.logo = logo;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

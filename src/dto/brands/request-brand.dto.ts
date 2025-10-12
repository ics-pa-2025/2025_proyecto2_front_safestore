export class RequestBrandDto {
    name: string;
    description?: string;
    logo?: string;
    isActive?: boolean;

    constructor(
        name: string,
        description?: string,
        logo?: string,
        isActive?: boolean
    ) {
        this.name = name;
        this.description = description;
        this.logo = logo;
        this.isActive = isActive;
    }
}

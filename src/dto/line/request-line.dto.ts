export class RequestLineDto {
    name: string;
    description?: string;
    isActive?: boolean;

    constructor(name: string, description?: string, isActive: boolean = true) {
        this.name = name;
        this.description = description;
        this.isActive = isActive;
    }
}

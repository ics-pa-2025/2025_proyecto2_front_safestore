export class ResponseSupplierDto {
    id: number;
    name: string;
    phone: string;
    email: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(
        id: number,
        name: string,
        phone: string,
        email: string,
        isActive: boolean,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
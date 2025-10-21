export class ResponseCustomerDto {
    id: number;
    name: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
    documento: number;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(
        id: number,
        name: string,
        lastName: string,
        email: string,
        address: string,
        phone: string,
        documento: number,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.address = address;
        this.phone = phone;
        this.documento = documento;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
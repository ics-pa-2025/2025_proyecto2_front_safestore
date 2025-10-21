export class RequestCustomerDto {
    name: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
    documento: number;

    constructor(
        name: string,
        lastName: string,
        email: string,
        address: string,
        phone: string,
        documento: number
    ) {
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.address = address;
        this.phone = phone;
        this.documento = documento;
    }
}
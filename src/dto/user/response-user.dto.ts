export class ResponseUserDto {
    id: string;
    email: string;
    fullname?: string;
    phone?: string;
    address?: string;

    constructor(
        id: string,
        email: string,
        fullname: string,
        phone: string,
        address?: string
    ) {
        this.id = id;
        this.email = email;
        this.fullname = fullname;
        this.phone = phone;
        this.address = address;
    }
}

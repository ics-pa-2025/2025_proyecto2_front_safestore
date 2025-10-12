export class UpdateUserDto {
    fullname?: string;
    phone?: string;
    address?: string;

    constructor(fullname: string, phone: string, address?: string) {
        this.fullname = fullname;
        this.phone = phone;
        this.address = address;
    }
}

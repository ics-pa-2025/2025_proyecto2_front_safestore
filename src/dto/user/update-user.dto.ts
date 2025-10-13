export class UpdateUserDto {
    fullname?: string;
    phone?: string;
    address?: string;
    isActive?: boolean;


    constructor(fullname: string, phone: string, address?: string, isActive?: boolean) {
        this.fullname = fullname;
        this.phone = phone;
        this.address = address;
        this.isActive = isActive;
    }
}

export class BestSellingProductDto {
    idProduct: number;
    totalSales: number;
    productName: string;

    constructor(idProduct: number, totalSales: number, productName: string){
        this.idProduct = idProduct;
        this.totalSales = totalSales;
        this.productName = productName;
    }

}

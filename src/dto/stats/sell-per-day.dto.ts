export class SellPerDayDto {
    date: string;
    totalSales: number;


    constructor(date:string, totalSales: number){
        this.date = date;
        this.totalSales = totalSales;
    }

}

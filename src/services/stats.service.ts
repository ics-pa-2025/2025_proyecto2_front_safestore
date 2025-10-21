import type {AxiosResponse} from 'axios';
import {backApi} from '../api/backApi.ts';
import type { SellPerDayDto } from '../dto/stats/sell-per-day.dto.ts';
import type { BestSellingProductDto } from '../dto/stats/best-selling-product.dto.ts';

class StatsService {

        async getSellPerDay(): Promise<SellPerDayDto[]> {
        try {
            const response: AxiosResponse<SellPerDayDto[]> =
                await backApi.get('stats/sell-per-day');
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al actualizar el perfil');
        }
    }


    async getBestSellingProduct(): Promise<BestSellingProductDto[]> {
        try {
            const response: AxiosResponse<BestSellingProductDto[]> =
                await backApi.get('stats/best-selling-product');
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al actualizar el perfil');
        }
    }

}

export const statsService = new StatsService();

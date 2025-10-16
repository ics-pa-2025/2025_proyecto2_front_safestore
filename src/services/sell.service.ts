import type {AxiosResponse} from 'axios';
import {backApi} from '../api/backApi.ts';
import {RequestSellDto} from "../dto/sell/request-sell.dto.ts";
import type {ResponseSellDto} from "../dto/sell/response-sell.dto.ts";

class SellService {
    async create(requestSellDto: RequestSellDto): Promise<void> {
        try {
            await backApi.post('sell', requestSellDto);
        } catch (error) {
            console.log(error);
            throw new Error('Error al crear el perfil');
        }
    }

    async get(): Promise<ResponseSellDto[]> {
        try {
            const response: AxiosResponse<ResponseSellDto[]> =
                await backApi.get('sell');
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Error al actualizar el perfil');
        }
    }

}

export const sellService = new SellService();

import type {TableColumn} from "../../common/Table.tsx";
import type {ResponseSellDto} from "../../../dto/sell/response-sell.dto.ts";

export const columnSell: TableColumn<ResponseSellDto>[] = [
    {
        key: 'id',
        header: 'Codigo',
        align: 'left'
    },
    {
        key: 'total',
        header: 'Total',
        align: 'left'
    },
    {
        key: 'createdAt',
        header: 'fecha',
        align: 'left'
    },
    {
        key: 'idVendedor',
        header: 'Vendedor (id)',
        align: 'right',
    },
    {
        key: 'idComprador',
        header: 'Comprador (id)',
        align: 'right',
    }
];
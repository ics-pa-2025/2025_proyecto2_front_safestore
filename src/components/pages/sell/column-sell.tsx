import type {TableColumn} from "../../common/Table.tsx";
import type {ResponseSellDto} from "../../../dto/sell/response-sell.dto.ts";

export const columnSell: TableColumn<ResponseSellDto>[] = [
    {
        key: 'id',
        header: 'Code',
        align: 'left'
    },
    {
        key: 'total',
        header: 'Total',
        align: 'left'
    },
    {
        key: 'createdAt',
        header: 'Date',
        align: 'left'
    },
    {
        key: 'idVendedor',
        header: 'Seller (ID)',
        align: 'right',
    },
    {
        key: 'idComprador',
        header: 'Buyer (ID)',
        align: 'right',
    }
];
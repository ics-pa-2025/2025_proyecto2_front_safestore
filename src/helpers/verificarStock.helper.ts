import Swal from 'sweetalert2';
import type { ResponseProductDto } from '../dto/product/response-product.dto';

/**
 * Verifica si hay productos sin stock y muestra una alerta
 * @param productos - Array de productos a verificar
 * @returns Promise<void>
 */
export const verificarStockProductos = async (
    productos: ResponseProductDto[]
): Promise<void> => {
    // Filtrar productos con stock 0
    const productosSinStock = productos.filter(producto => producto.stock === 0);

    // Si hay productos sin stock, mostrar alerta
    if (productosSinStock.length > 0) {
        const listaProductos = productosSinStock
            .map(producto => `• ${producto.name}`)
            .join('<br>');

        await Swal.fire({
            title: 'Products Out of Stock',
            html: `
                <p class="text-left mb-3">The following products have <strong>0 stock</strong>:</p>
                <div class="text-left bg-gray-50 p-3 rounded-md max-h-60 overflow-y-auto">
                    ${listaProductos}
                </div>
                <p class="text-left mt-3 text-sm text-gray-600">
                    Total: <strong>${productosSinStock.length}</strong> product(s) without stock
                </p>
            `,
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
            customClass: {
                popup: 'swal-wide'
            }
        });
    }
};

/**
 * Verifica si hay productos con stock bajo (threshold configurable)
 * @param productos - Array de productos a verificar
 * @param threshold - Umbral de stock bajo (por defecto 5)
 * @returns Promise<void>
 */
export const verificarStockBajo = async (
    productos: ResponseProductDto[],
    threshold: number = 5
): Promise<void> => {
    // Filtrar productos con stock bajo (mayor a 0 pero menor o igual al threshold)
    const productosStockBajo = productos.filter(
        producto => producto.stock > 0 && producto.stock <= threshold
    );

    // Si hay productos con stock bajo, mostrar alerta
    if (productosStockBajo.length > 0) {
        const listaProductos = productosStockBajo
            .map(producto => `• ${producto.name} (Stock: ${producto.stock})`)
            .join('<br>');

        await Swal.fire({
            title: 'Low Stock Alert',
            html: `
                <p class="text-left mb-3">The following products have <strong>low stock</strong>:</p>
                <div class="text-left bg-yellow-50 p-3 rounded-md max-h-60 overflow-y-auto">
                    ${listaProductos}
                </div>
                <p class="text-left mt-3 text-sm text-gray-600">
                    Total: <strong>${productosStockBajo.length}</strong> product(s) with stock ≤ ${threshold}
                </p>
            `,
            icon: 'info',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
            customClass: {
                popup: 'swal-wide'
            }
        });
    }
};

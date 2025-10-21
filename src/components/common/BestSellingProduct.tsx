import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { BestSellingProductDto } from '../../dto/stats/best-selling-product.dto';
import { statsService } from '../../services/stats.service';

const BestSellingProduct: React.FC = () => {

    const [bestSellingProduct, setBestSellingProduct] = useState<BestSellingProductDto[]>([]);

    useEffect(() => {
        loadBestSellingProduct();
    }, []);
        
    const loadBestSellingProduct = async () => {
        try {
            const data = await statsService.getBestSellingProduct();
            setBestSellingProduct(data);
            console.log(bestSellingProduct);
        } catch (error) {
            console.error('Error cargando productos más vendidos:', error);
        }
    };


    // Validar que data sea un array
    if (!bestSellingProduct || !Array.isArray(bestSellingProduct) || bestSellingProduct.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Productos Más Vendidos</h2>
                <div className="flex items-center justify-center h-[350px] text-gray-500">
                    No hay datos disponibles
                </div>
            </div>
        );
    }

    // Transformar datos para ApexCharts - tomar top 8 productos
    const topProducts = bestSellingProduct.slice(0, 8);
    const categories = topProducts.map(item => item.productName);
    const seriesData = topProducts.map(item => item.totalSales);

    const chartOptions: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                }
            },
            animations: {
                enabled: true,
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
                columnWidth: '70%',
                distributed: true, // Cada barra con color diferente
            }
        },
        colors: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'],
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: categories,
            labels: {
                rotate: -45,
                rotateAlways: false,
                style: {
                    fontSize: '12px'
                }
            },
            title: {
                text: 'Productos'
            }
        },
        yaxis: {
            title: {
                text: 'Unidades Vendidas'
            }
        },
        grid: {
            borderColor: '#e7e7e7',
            strokeDashArray: 5,
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (val) => `${val} unidades`
            }
        },
        legend: {
            show: false // Ocultar leyenda cuando distributed=true
        }
    };

    const series = [{
        name: 'Unidades Vendidas',
        data: seriesData
    }];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Productos Más Vendidos</h2>
            <Chart 
                options={chartOptions} 
                series={series} 
                type="bar" 
                height={350}
            />
        </div>
    );
};

export default BestSellingProduct;

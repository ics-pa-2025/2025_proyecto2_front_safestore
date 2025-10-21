import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { SellPerDayDto } from '../../dto/stats/sell-per-day.dto';
import { statsService } from '../../services/stats.service';

const SellPerDay: React.FC = () => {

    const [sellPerDay, setSellPerDay] = useState<SellPerDayDto[]>([]);
    
    useEffect(() => {
            loadSellPerDay();
    }, []);
    

    const loadSellPerDay = async () => {
        try {
            const data = await statsService.getSellPerDay();
            setSellPerDay(data);
        } catch (error) {
            console.error('Error cargando ventas por día:', error);
        }
    };

    // Validar que data sea un array
    if (!sellPerDay || !Array.isArray(sellPerDay) || sellPerDay.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Ventas por Día</h2>
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                    No hay datos disponibles
                </div>
            </div>
        );
    }

    // Transformar datos para ApexCharts
    const categories = sellPerDay.map(item => item.date);
    const seriesData = sellPerDay.map(item => item.totalSales);

    const chartOptions: ApexOptions = {
        chart: {
            type: 'line',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    zoom: true,
                    pan: true,
                }
            },
            animations: {
                enabled: true,
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        colors: ['#8884d8'],
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: categories,
            labels: {
                rotate: -45,
                rotateAlways: false,
            },
            title: {
                text: 'Fecha'
            }
        },
        yaxis: {
            title: {
                text: 'Total de Ventas'
            }
        },
        grid: {
            borderColor: '#e7e7e7',
            strokeDashArray: 5,
        },
        markers: {
            size: 5,
            hover: {
                size: 7
            }
        },
        tooltip: {
            theme: 'light',
            x: {
                show: true
            }
        }
    };

    const series = [{
        name: 'Ventas',
        data: seriesData
    }];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Ventas por Día</h2>
            <Chart 
                options={chartOptions} 
                series={series} 
                type="line" 
                height={300}
            />
        </div>
    );
};

export default SellPerDay;

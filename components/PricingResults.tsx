import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, DollarSign, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface PricingOption {
    type: 'optimal' | 'aggressive' | 'minimum';
    price: number;
    profitMargin: number;
    description: string;
    recommendation: string;
}

interface PricingResultsProps {
    options: PricingOption[];
    totalCosts: number;
    inputData?: {
        utilizationRate: number;
        demandFactor: number;
        maxShipments: number;
        effectiveUnits: number;
        costPerUnit: number;
        fixedCosts: number;
        variableCosts: number;
    };
}

export default function PricingResults({ options, totalCosts, inputData }: PricingResultsProps) {
    const getCardStyle = (type: string) => {
        switch (type) {
            case 'optimal':
                return {
                    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
                    border: 'border-[#203864]',
                    icon: <TrendingUp className="w-6 h-6 text-[#203864]" />,
                    iconBg: 'bg-[#203864]',
                    badge: 'bg-[#203864] text-white',
                    title: 'Harga Optimal'
                };
            case 'aggressive':
                return {
                    bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
                    border: 'border-[#FF5722]',
                    icon: <Zap className="w-6 h-6 text-[#FF5722]" />,
                    iconBg: 'bg-[#FF5722]',
                    badge: 'bg-[#FF5722] text-white',
                    title: 'Harga Agresif'
                };
            case 'minimum':
                return {
                    bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
                    border: 'border-gray-400',
                    icon: <DollarSign className="w-6 h-6 text-gray-600" />,
                    iconBg: 'bg-gray-600',
                    badge: 'bg-gray-600 text-white',
                    title: 'Harga Minimum (Break-even)'
                };
            default:
                return {
                    bg: 'bg-white',
                    border: 'border-gray-200',
                    icon: <DollarSign className="w-6 h-6" />,
                    iconBg: 'bg-gray-500',
                    badge: 'bg-gray-500 text-white',
                    title: 'Price'
                };
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getMarginIndicator = (margin: number) => {
        if (margin > 0) {
            // Positive margin - green up arrow
            return <ArrowUp className="w-5 h-5 text-green-700 font-bold" strokeWidth={3} />;
        } else if (margin === 0) {
            return <Minus className="w-5 h-5 text-gray-600" strokeWidth={3} />;
        } else {
            // Negative margin - red down arrow
            return <ArrowDown className="w-5 h-5 text-red-600" strokeWidth={3} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-[#203864] mb-2">
                    Pricing Recommendations
                </h3>
                <p className="text-gray-600">
                    AI-powered pricing strategies based on your parameters
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {options.map((option) => {
                    const style = getCardStyle(option.type);
                    // Use actual cost per unit from backend calculation
                    const costPerUnit = inputData?.costPerUnit || 0;
                    const profit = option.price - costPerUnit;

                    return (
                        <Card
                            key={option.type}
                            className={`border-2 ${style.border} ${style.bg} hover:shadow-xl transition-shadow duration-300`}
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`w-12 h-12 ${style.iconBg} rounded-xl flex items-center justify-center`}>
                                        {style.icon}
                                    </div>
                                    <Badge className={style.badge}>
                                        {option.type.toUpperCase()}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl">{style.title}</CardTitle>
                                <CardDescription className="text-sm">
                                    {option.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center py-4 bg-white/50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Recommended Price</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {formatCurrency(option.price)}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Profit Margin</span>
                                        <div className="flex items-center gap-1">
                                            {getMarginIndicator(profit)}
                                            <span className="font-semibold">
                                                {option.profitMargin.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Profit per Unit</span>
                                        <span className="font-semibold">
                                            {formatCurrency(profit)}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t">
                                    <p className="text-xs text-gray-700 italic">
                                        💡 {option.recommendation}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-orange-50">
                <CardHeader>
                    <CardTitle className="text-lg">Cost Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700">Total Costs (Fixed + Variable)</span>
                        <span className="text-xl font-bold text-[#203864]">
                            {formatCurrency(totalCosts)}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Calculation Details */}
            {inputData && (
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <span>📊</span> Calculation Details
                        </CardTitle>
                        <CardDescription>
                            Step-by-step breakdown of pricing calculation
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Step 1: Capacity Calculation */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-[#203864] flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[#203864] text-white flex items-center justify-center text-sm">1</span>
                                Capacity Calculation
                            </h4>
                            <div className="pl-8 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Max Shipments per Container:</span>
                                    <span className="font-medium">{inputData.maxShipments} units</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Utilization Rate:</span>
                                    <span className="font-medium">{inputData.utilizationRate}%</span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span className="text-gray-700 font-medium">Effective Units:</span>
                                    <span className="font-bold text-[#203864]">
                                        {inputData.effectiveUnits} units
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 italic">
                                    Formula: {inputData.maxShipments} × {inputData.utilizationRate}% = {inputData.effectiveUnits} units
                                </p>
                            </div>
                        </div>

                        {/* Step 2: Cost Breakdown */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-[#203864] flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[#203864] text-white flex items-center justify-center text-sm">2</span>
                                Cost Breakdown
                            </h4>
                            <div className="pl-8 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Fixed Costs:</span>
                                    <span className="font-medium">{formatCurrency(inputData.fixedCosts)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Variable Costs:</span>
                                    <span className="font-medium">{formatCurrency(inputData.variableCosts)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span className="text-gray-700 font-medium">Total Costs:</span>
                                    <span className="font-bold text-[#203864]">
                                        {formatCurrency(totalCosts)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Cost Per Unit */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-[#203864] flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[#203864] text-white flex items-center justify-center text-sm">3</span>
                                Cost Per Unit (Key Metric)
                            </h4>
                            <div className="pl-8 space-y-2 text-sm">
                                <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                                    <span className="text-gray-700 font-medium">Cost per Shipment:</span>
                                    <span className="font-bold text-[#203864] text-lg">
                                        {formatCurrency(inputData.costPerUnit)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 italic">
                                    Formula: {formatCurrency(totalCosts)} ÷ {inputData.effectiveUnits} units = {formatCurrency(inputData.costPerUnit)}
                                </p>
                            </div>
                        </div>

                        {/* Step 4: Pricing Strategies */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-[#203864] flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[#203864] text-white flex items-center justify-center text-sm">4</span>
                                Pricing Strategies Applied
                            </h4>
                            <div className="pl-8 space-y-3 text-sm">
                                {options.map((option) => {
                                    const costPerUnit = inputData.costPerUnit;
                                    const profit = option.price - costPerUnit;
                                    return (
                                        <div key={option.type} className="border-l-4 border-[#203864] pl-3 py-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium text-gray-700">
                                                    {option.type === 'optimal' ? '🔵 Harga Optimal' :
                                                        option.type === 'aggressive' ? '🟠 Harga Agresif' :
                                                            '⚪ Harga Minimum'}
                                                </span>
                                                <span className="font-bold">{formatCurrency(option.price)}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Margin: {option.profitMargin.toFixed(1)}% |
                                                Profit: {formatCurrency(profit)}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Market Factors */}
                        <div className="space-y-3 bg-orange-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-[#FF5722] flex items-center gap-2">
                                <span>📈</span> Market Factors
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Demand Factor:</span>
                                    <span className="font-medium">{inputData.demandFactor.toFixed(1)}x</span>
                                </div>
                                <p className="text-xs text-gray-500 italic">
                                    {inputData.demandFactor > 1.2 ? '🔥 High demand - Premium pricing recommended' :
                                        inputData.demandFactor < 0.8 ? '📉 Low demand - Competitive pricing recommended' :
                                            '📊 Normal demand - Standard pricing applies'}
                                </p>
                            </div>
                        </div>

                        {/* Total Revenue Projection */}
                        <div className="space-y-3 bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-200">
                            <h4 className="font-semibold text-green-700 flex items-center gap-2">
                                <span>💰</span> Total Revenue Projection
                            </h4>
                            <p className="text-xs text-gray-600 mb-3">
                                Estimated revenue based on {inputData.effectiveUnits} effective units
                            </p>
                            <div className="space-y-3">
                                {options.map((option) => {
                                    const totalRevenue = option.price * inputData.effectiveUnits;
                                    const costPerUnit = inputData.costPerUnit;
                                    const totalProfit = (option.price - costPerUnit) * inputData.effectiveUnits;

                                    return (
                                        <div key={option.type} className="bg-white p-3 rounded-lg shadow-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium text-sm">
                                                    {option.type === 'optimal' ? '🔵 Optimal Strategy' :
                                                        option.type === 'aggressive' ? '🟠 Aggressive Strategy' :
                                                            '⚪ Minimum Strategy'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatCurrency(option.price)} × {inputData.effectiveUnits} units
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Total Revenue:</span>
                                                    <span className="font-bold text-green-700">
                                                        {formatCurrency(totalRevenue)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Total Profit:</span>
                                                    <span className="font-bold text-[#203864]">
                                                        {formatCurrency(totalProfit)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs pt-1 border-t">
                                                    <span className="text-gray-500">ROI:</span>
                                                    <span className="font-medium text-green-600">
                                                        {((totalProfit / totalCosts) * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-3 pt-3 border-t border-green-200">
                                <p className="text-xs text-gray-600 italic">
                                    💡 Revenue calculated based on full capacity utilization ({inputData.utilizationRate}%)
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign } from 'lucide-react';
import PricingInputForm, { PricingFormData } from '@/components/PricingInputForm';
import PricingResults from '@/components/PricingResults';

interface PricingOption {
    type: 'optimal' | 'aggressive' | 'minimum';
    price: number;
    profitMargin: number;
    description: string;
    recommendation: string;
}

interface PricingResponse {
    success: boolean;
    input: {
        basePrice: number;
        utilizationRate: number;
        demandFactor: number;
        totalCosts: number;
        maxShipments: number;
        effectiveUnits: number;
        costPerUnit: number;
        fixedCosts: number;
        variableCosts: number;
    };
    options: PricingOption[];
}

export default function DynamicPricingPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState<PricingResponse | null>(null);
    const [formData, setFormData] = useState<PricingFormData | null>(null);

    const handleCalculate = async (data: PricingFormData) => {
        setLoading(true);
        setError('');
        setResults(null);
        setFormData(data);

        try {
            const response = await fetch('/api/pricing/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                setError(responseData.error || 'Failed to calculate pricing');
                setLoading(false);
                return;
            }

            setResults(responseData);
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#203864] rounded-xl flex items-center justify-center">
                        <DollarSign className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-[#203864]">
                            Dynamic Pricing
                        </h1>
                        <p className="text-lg text-gray-600">
                            AI-powered pricing engine with optimal pricing strategies
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Input Form */}
            <PricingInputForm onCalculate={handleCalculate} loading={loading} />

            {/* Results */}
            {results && (
                <PricingResults
                    options={results.options}
                    totalCosts={results.input.totalCosts}
                    inputData={{
                        utilizationRate: results.input.utilizationRate,
                        demandFactor: results.input.demandFactor,
                        maxShipments: results.input.maxShipments,
                        effectiveUnits: results.input.effectiveUnits,
                        costPerUnit: results.input.costPerUnit,
                        fixedCosts: results.input.fixedCosts,
                        variableCosts: results.input.variableCosts
                    }}
                />
            )}

            {/* Info Card */}
            {!results && (
                <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold text-[#203864] mb-3">How It Works</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-[#203864] text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                1
                            </div>
                            <p>Enter your base pricing and cost parameters</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-[#203864] text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                2
                            </div>
                            <p>AI engine analyzes utilization rate and market demand</p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-[#203864] text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                3
                            </div>
                            <p>Get 3 pricing strategies: Optimal, Aggressive, and Minimum (break-even)</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

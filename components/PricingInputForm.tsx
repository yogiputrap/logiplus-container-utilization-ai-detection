'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Calculator, Loader2 } from 'lucide-react';

interface PricingInputFormProps {
    onCalculate: (data: PricingFormData) => void;
    loading: boolean;
}

export interface PricingFormData {
    basePrice: number;
    utilizationRate: number;
    demandFactor: number;
    fixedCosts: number;
    variableCosts: number;
    maxShipments: number;
}

export default function PricingInputForm({ onCalculate, loading }: PricingInputFormProps) {
    const [formData, setFormData] = useState<PricingFormData>({
        basePrice: 100000,
        utilizationRate: 80,
        demandFactor: 1.0,
        fixedCosts: 2000000,
        variableCosts: 1200000,
        maxShipments: 40
    });

    // Display values with thousand separators
    const [displayValues, setDisplayValues] = useState({
        basePrice: '100.000',
        fixedCosts: '2.000.000',
        variableCosts: '1.200.000'
    });

    // Format number with thousand separator (dots)
    const formatNumber = (value: number): string => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Parse formatted string to number
    const parseNumber = (value: string): number => {
        return Number(value.replace(/\./g, ''));
    };

    // Handle currency input change
    const handleCurrencyChange = (field: 'basePrice' | 'fixedCosts' | 'variableCosts', value: string) => {
        // Remove all non-digit characters
        const numericValue = value.replace(/\D/g, '');
        const numberValue = numericValue === '' ? 0 : Number(numericValue);

        // Update form data with actual number
        setFormData({ ...formData, [field]: numberValue });

        // Update display value with formatting
        setDisplayValues({ ...displayValues, [field]: numericValue === '' ? '' : formatNumber(numberValue) });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCalculate(formData);
    };

    const handleReset = () => {
        setFormData({
            basePrice: 100000,
            utilizationRate: 80,
            demandFactor: 1.0,
            fixedCosts: 2000000,
            variableCosts: 1200000,
            maxShipments: 40
        });
        setDisplayValues({
            basePrice: '100.000',
            fixedCosts: '2.000.000',
            variableCosts: '1.200.000'
        });
    };

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#203864]" />
                    Pricing Parameters
                </CardTitle>
                <CardDescription>
                    Enter your pricing parameters to calculate optimal pricing strategies
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="basePrice">Base Price (Rp)</Label>
                        <Input
                            id="basePrice"
                            type="text"
                            value={displayValues.basePrice}
                            onChange={(e) => handleCurrencyChange('basePrice', e.target.value)}
                            required
                            className="focus:ring-[#203864]"
                            placeholder="100.000"
                        />
                        <p className="text-sm text-gray-500">Reference price per shipment</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="utilizationRate">
                            Container Utilization Rate: {formData.utilizationRate}%
                        </Label>
                        <Slider
                            id="utilizationRate"
                            min={0}
                            max={100}
                            step={5}
                            value={[formData.utilizationRate]}
                            onValueChange={(value) => setFormData({ ...formData, utilizationRate: value[0] })}
                            className="py-4"
                        />
                        <p className="text-sm text-gray-500">Current capacity usage percentage</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="demandFactor">
                            Market Demand Factor: {formData.demandFactor.toFixed(1)}x
                        </Label>
                        <Slider
                            id="demandFactor"
                            min={0.5}
                            max={2.0}
                            step={0.1}
                            value={[formData.demandFactor]}
                            onValueChange={(value) => setFormData({ ...formData, demandFactor: value[0] })}
                            className="py-4"
                        />
                        <p className="text-sm text-gray-500">
                            Market demand multiplier (0.5 = low, 1.0 = normal, 2.0 = high)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fixedCosts">Fixed Costs (Rp)</Label>
                        <Input
                            id="fixedCosts"
                            type="text"
                            value={displayValues.fixedCosts}
                            onChange={(e) => handleCurrencyChange('fixedCosts', e.target.value)}
                            required
                            className="focus:ring-[#203864]"
                            placeholder="2.000.000"
                        />
                        <p className="text-sm text-gray-500">Operational overhead costs</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="variableCosts">Variable Costs (Rp)</Label>
                        <Input
                            id="variableCosts"
                            type="text"
                            value={displayValues.variableCosts}
                            onChange={(e) => handleCurrencyChange('variableCosts', e.target.value)}
                            required
                            className="focus:ring-[#203864]"
                            placeholder="1.200.000"
                        />
                        <p className="text-sm text-gray-500">Per-trip variable costs</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="maxShipments">Max Shipments per Container</Label>
                        <Input
                            id="maxShipments"
                            type="number"
                            value={formData.maxShipments}
                            onChange={(e) => setFormData({ ...formData, maxShipments: Number(e.target.value) })}
                            min="1"
                            step="1"
                            required
                            className="focus:ring-[#203864]"
                        />
                        <p className="text-sm text-gray-500">Maximum number of shipments per container/truck</p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[#FF5722] hover:bg-[#E64A19]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Calculating...
                                </>
                            ) : (
                                <>
                                    <Calculator className="mr-2 h-4 w-4" />
                                    Calculate Pricing
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={loading}
                        >
                            Reset
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

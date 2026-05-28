import { NextRequest, NextResponse } from 'next/server';

interface PricingInput {
    basePrice: number;
    utilizationRate: number; // 0-100
    demandFactor: number; // 0.5-2.0
    fixedCosts: number;
    variableCosts: number;
    maxShipments: number; // Max shipments per container
}

interface PricingOption {
    type: 'optimal' | 'aggressive' | 'minimum';
    price: number;
    profitMargin: number;
    description: string;
    recommendation: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: PricingInput = await request.json();

        const { basePrice, utilizationRate, demandFactor, fixedCosts, variableCosts, maxShipments } = body;

        // Validation
        if (!basePrice || !utilizationRate || !demandFactor || fixedCosts === undefined || variableCosts === undefined || !maxShipments) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        if (utilizationRate < 0 || utilizationRate > 100) {
            return NextResponse.json(
                { error: 'Utilization rate must be between 0 and 100' },
                { status: 400 }
            );
        }

        if (maxShipments <= 0) {
            return NextResponse.json(
                { error: 'Max shipments must be greater than 0' },
                { status: 400 }
            );
        }

        // Calculate effective units based on utilization
        const utilizationFactor = utilizationRate / 100;
        const effectiveUnits = Math.floor(maxShipments * utilizationFactor);

        // Prevent division by zero
        if (effectiveUnits === 0) {
            return NextResponse.json(
                { error: 'Utilization too low - no effective shipments' },
                { status: 400 }
            );
        }

        // Calculate total costs
        const totalCosts = fixedCosts + variableCosts;

        // Cost per unit (KEY FIX)
        const costPerUnit = totalCosts / effectiveUnits;

        // PRICING STRATEGIES (ECONOMICALLY SOUND)

        // 1. MINIMUM PRICE (Dynamic margin 10-15% based on market conditions)
        // Formula: price = cost / (1 - margin) to get exact profit margin
        // Base margin: 10%, increases up to 15% based on utilization and demand
        const baseMinimumMargin = 0.10; // 10% base
        const utilizationBonus = utilizationFactor * 0.03; // Up to 3% from utilization
        const demandBonus = (demandFactor - 1.0) * 0.02; // Up to 2% from demand
        const minimumMarginTarget = Math.min(0.15, baseMinimumMargin + utilizationBonus + demandBonus); // Cap at 15%

        const minimumPrice = Math.round(costPerUnit / (1 - minimumMarginTarget));
        const minimumProfit = minimumPrice - costPerUnit;
        const minimumMargin = ((minimumProfit / minimumPrice) * 100);

        // 2. OPTIMAL PRICE (Healthy Margin 20-35% based on demand)
        // Dynamic margin based on demand factor
        const baseOptimalMargin = 0.20; // 20% base
        const optimalDemandBonus = (demandFactor - 1.0) * 0.15; // Up to 15% from demand
        const optimalMarginTarget = Math.min(0.35, baseOptimalMargin + optimalDemandBonus); // Cap at 35%

        const optimalPrice = Math.round(costPerUnit / (1 - optimalMarginTarget));
        const optimalProfit = optimalPrice - costPerUnit;
        const optimalMargin = ((optimalProfit / optimalPrice) * 100);

        // 3. AGGRESSIVE PRICE (Competitive 15-20% based on utilization)
        // Lower margin when utilization is low to attract more bookings
        const baseAggressiveMargin = 0.15; // 15% base
        const aggressiveUtilizationBonus = utilizationFactor * 0.05; // Up to 5% from utilization
        const aggressiveMarginTarget = Math.min(0.20, baseAggressiveMargin + aggressiveUtilizationBonus); // Cap at 20%

        const aggressivePrice = Math.round(costPerUnit / (1 - aggressiveMarginTarget));
        const aggressiveProfit = aggressivePrice - costPerUnit;
        const aggressiveProfitMargin = ((aggressiveProfit / aggressivePrice) * 100);

        const pricingOptions: PricingOption[] = [
            {
                type: 'optimal',
                price: optimalPrice,
                profitMargin: parseFloat(optimalMargin.toFixed(1)),
                description: 'Healthy margin (20-35%) based on demand factor',
                recommendation: utilizationRate > 70
                    ? 'Recommended for high demand periods'
                    : 'Standard pricing for normal operations'
            },
            {
                type: 'aggressive',
                price: aggressivePrice,
                profitMargin: parseFloat(aggressiveProfitMargin.toFixed(1)),
                description: 'Competitive margin (15-20%) based on utilization',
                recommendation: utilizationRate < 50
                    ? 'Recommended to increase bookings'
                    : 'Use to compete with lower-priced alternatives'
            },
            {
                type: 'minimum',
                price: minimumPrice,
                profitMargin: parseFloat(minimumMargin.toFixed(1)),
                description: 'Dynamic safe margin (10-15%) based on market conditions',
                recommendation: 'Only use during low demand or to fill remaining capacity'
            }
        ];

        return NextResponse.json({
            success: true,
            input: {
                basePrice,
                utilizationRate,
                demandFactor,
                totalCosts,
                maxShipments,
                effectiveUnits,
                costPerUnit: Math.round(costPerUnit),
                fixedCosts,
                variableCosts
            },
            options: pricingOptions
        });

    } catch (error) {
        console.error('Pricing calculation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/*
 * Pricing Engine — Calculates quotes based on model analysis
 * 
 * FDM: Price = setupFee + (printTimeHours × pricePerHour) + (weightGrams × pricePerGram)
 * Others: Price = setupFee + (volumeCm3 × pricePerCm3)
 * 
 * Then: quantity discount, rush multiplier, shipping
 */

import { MATERIALS, QUANTITY_DISCOUNTS, RUSH_MULTIPLIER, SHIPPING_RATES } from '../config/materials'
import { estimateFDMPrintTime } from './stlParser'

/**
 * Calculate a complete quote
 * @param {Object} params
 * @param {string} params.materialId - Material ID from config
 * @param {Object} params.modelData - Parsed STL data { volumeCm3, dimensions, surfaceAreaCm2 }
 * @param {number} params.quantity - Number of units
 * @param {boolean} params.isRush - Rush order flag
 * @param {string} params.shippingMethod - 'standard' | 'express' | 'priority'
 * @param {number} params.infillPercent - FDM infill percentage (for FDM only)
 * @param {number} params.layerHeight - FDM layer height in mm (for FDM only)
 * @returns {Object} Complete quote breakdown
 */
export function calculateQuote({
    materialId,
    modelData,
    quantity = 1,
    isRush = false,
    shippingMethod = 'standard',
    infillPercent = 20,
}) {
    const material = MATERIALS[materialId]
    if (!material) throw new Error(`Unknown material: ${materialId}`)

    let unitPrice = 0
    let printTimeHours = 0
    let materialWeight = 0
    let breakdown = {}

    if (material.tech === 'FDM') {
        // ─── FDM: Price by print time ───
        printTimeHours = estimateFDMPrintTime(
            modelData.volumeCm3,
            0.2,
            infillPercent,
            modelData.dimensions,
            modelData.surfaceAreaMm2 || (modelData.surfaceAreaCm2 ? modelData.surfaceAreaCm2 * 100 : null)
        )

        // Material weight in grams
        const shellFraction = 0.25
        const effectiveVolume = modelData.volumeCm3 * (shellFraction + (1 - shellFraction) * (infillPercent / 100))
        materialWeight = effectiveVolume * material.density // grams

        const timeCost = printTimeHours * material.pricePerHour
        const materialCost = materialWeight * material.pricePerGram

        unitPrice = material.setupFee + timeCost + materialCost

        breakdown = {
            setupFee: material.setupFee,
            timeCost: { hours: printTimeHours, rate: material.pricePerHour, total: timeCost },
            materialCost: { grams: materialWeight, rate: material.pricePerGram, total: materialCost },
            unitSubtotal: unitPrice,
        }
    } else {
        // ─── SLA/SLS/MJF/SLM: Price by volume ───
        const volumeCost = modelData.volumeCm3 * material.pricePerCm3
        materialWeight = modelData.volumeCm3 * material.density

        unitPrice = material.setupFee + volumeCost

        breakdown = {
            setupFee: material.setupFee,
            volumeCost: { cm3: modelData.volumeCm3, rate: material.pricePerCm3, total: volumeCost },
            weight: { grams: materialWeight },
            unitSubtotal: unitPrice,
        }
    }

    // Enforce minimum price
    unitPrice = Math.max(unitPrice, material.minPrice)
    breakdown.minPriceApplied = unitPrice === material.minPrice

    // ─── Quantity pricing ───
    const subtotal = unitPrice * quantity
    const discount = getQuantityDiscount(quantity)
    const discountAmount = subtotal * discount.discount
    const afterDiscount = subtotal - discountAmount

    // ─── Rush order ───
    const rushSurcharge = isRush ? afterDiscount * (RUSH_MULTIPLIER - 1) : 0
    const afterRush = afterDiscount + rushSurcharge

    // ─── Shipping ───
    const shipping = SHIPPING_RATES[shippingMethod] || SHIPPING_RATES.standard
    const total = afterRush + shipping.price

    return {
        material: {
            id: material.id,
            name: material.name,
            fullName: material.fullName,
            tech: material.tech,
        },
        model: {
            volumeCm3: modelData.volumeCm3,
            dimensions: modelData.dimensions,
            triangleCount: modelData.triangleCount,
        },
        pricing: {
            breakdown,
            unitPrice,
            quantity,
            subtotal,
            discount: {
                ...discount,
                amount: discountAmount,
            },
            afterDiscount,
            isRush,
            rushSurcharge,
            afterRush,
            shipping: {
                method: shippingMethod,
                label: shipping.label,
                price: shipping.price,
                days: shipping.days,
            },
            total,
        },
        printTimeHours: material.tech === 'FDM' ? printTimeHours : null,
        materialWeight,
        leadTime: material.tech === 'FDM'
            ? (isRush ? '1-2 business days' : '2-5 business days')
            : (isRush ? halveLeadTime(MATERIALS[materialId]) : MATERIALS[materialId].leadTime),
    }
}

function getQuantityDiscount(quantity) {
    for (const tier of QUANTITY_DISCOUNTS) {
        if (quantity >= tier.min && quantity <= tier.max) {
            return tier
        }
    }
    return QUANTITY_DISCOUNTS[0]
}

function halveLeadTime(material) {
    // Parse lead time and halve it for rush
    const match = material.leadTime?.match(/(\d+)-(\d+)/)
    if (match) {
        const min = Math.max(1, Math.floor(parseInt(match[1]) / 2))
        const max = Math.max(2, Math.floor(parseInt(match[2]) / 2))
        return `${min}-${max} business days (RUSH)`
    }
    return '2-3 business days (RUSH)'
}

/**
 * Format currency
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount)
}

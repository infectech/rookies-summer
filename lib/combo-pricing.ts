import { ComboProduct } from "@/types";

export function getTierForSlots(combo: ComboProduct, slots: number) {
  return combo.pricingTiers.find((t) => t.slots === slots) ?? combo.pricingTiers[0];
}

export function getComboPrice(combo: ComboProduct, slots: number): number {
  return getTierForSlots(combo, slots).comboPrice;
}

export function getComboRegularTotal(combo: ComboProduct, slots: number): number {
  return combo.unitRegularPrice * slots;
}

export function getComboSavings(combo: ComboProduct, slots: number): number {
  return getComboRegularTotal(combo, slots) - getComboPrice(combo, slots);
}

export function getAvailableSlotCounts(combo: ComboProduct): number[] {
  return combo.pricingTiers.map((t) => t.slots).sort((a, b) => a - b);
}

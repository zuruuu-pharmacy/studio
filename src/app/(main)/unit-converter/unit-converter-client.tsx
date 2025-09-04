
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const conversionFactors: { [key: string]: { [key: string]: number } } = {
  mass: {
    g: 1,
    mg: 1000,
    mcg: 1000000,
  },
  weight: {
    kg: 1,
    lb: 2.20462,
  },
  volume: {
    L: 1,
    mL: 1000,
  },
};

const unitLabels: { [key: string]: { [key: string]: string } } = {
  mass: {
    g: 'Grams (g)',
    mg: 'Milligrams (mg)',
    mcg: 'Micrograms (mcg)',
  },
  weight: {
    kg: 'Kilograms (kg)',
    lb: 'Pounds (lb)',
  },
  volume: {
    L: 'Liters (L)',
    mL: 'Milliliters (mL)',
  },
  temperature: {
    C: 'Celsius (°C)',
    F: 'Fahrenheit (°F)',
    K: 'Kelvin (K)',
  }
};

type UnitCategory = 'mass' | 'weight' | 'volume' | 'temperature';

export function UnitConverterClient() {
  const [category, setCategory] = useState<UnitCategory>('mass');
  const [inputValue, setInputValue] = useState<string>('1');
  
  const unitsForCategory = Object.keys(unitLabels[category]);
  
  const [fromUnit, setFromUnit] = useState<string>(unitsForCategory[0]);
  const [toUnit, setToUnit] = useState<string>(unitsForCategory[1]);

  // Reset units when category changes
  useEffect(() => {
    const newUnits = Object.keys(unitLabels[category]);
    setFromUnit(newUnits[0]);
    setToUnit(newUnits[1]);
  }, [category]);

  const handleSwap = () => {
    const newFrom = toUnit;
    const newTo = fromUnit;
    const newInputValue = convertedValue;
    
    setFromUnit(newFrom);
    setToUnit(newTo);
    setInputValue(newInputValue);
  };
  
  const convertedValue = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';

    if (category === 'temperature') {
        let celsiusValue: number;
        // First, convert input to a base of Celsius
        if (fromUnit === 'C') {
            celsiusValue = value;
        } else if (fromUnit === 'F') {
            celsiusValue = (value - 32) * 5/9;
        } else { // Kelvin
            celsiusValue = value - 273.15;
        }

        // Then, convert from Celsius to the target unit
        let result: number;
        if (toUnit === 'C') {
            result = celsiusValue;
        } else if (toUnit === 'F') {
            result = (celsiusValue * 9/5) + 32;
        } else { // Kelvin
            result = celsiusValue + 273.15;
        }
        return Number(result.toPrecision(10)).toString();

    } else {
        if (!conversionFactors[category]) return '';
        const fromFactor = conversionFactors[category][fromUnit];
        const toFactor = conversionFactors[category][toUnit];

        const baseValue = value / fromFactor;
        const result = baseValue * toFactor;

        // Avoid floating point inaccuracies for display
        return Number(result.toPrecision(10)).toString();
    }

  }, [inputValue, fromUnit, toUnit, category]);

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Clinical Unit Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Conversion Type</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as UnitCategory)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mass">Mass</SelectItem>
              <SelectItem value="weight">Weight</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="temperature">Temperature</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-5 items-center gap-2">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="from-value">From</Label>
            <Input
              id="from-value"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitsForCategory.map(unit => (
                  <SelectItem key={unit} value={unit}>{unitLabels[category][unit]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1 flex justify-center pt-8">
            <Button variant="ghost" size="icon" onClick={handleSwap}>
              <ArrowRightLeft className="h-6 w-6 text-primary" />
            </Button>
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="to-value">To</Label>
            <Input id="to-value" value={convertedValue} readOnly className="font-bold bg-muted" />
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                 {unitsForCategory.map(unit => (
                  <SelectItem key={unit} value={unit}>{unitLabels[category][unit]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

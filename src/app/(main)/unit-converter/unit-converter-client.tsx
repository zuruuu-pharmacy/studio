
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRightLeft, ChevronsDown } from 'lucide-react';
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
  concentration: {
    'percent_w_v': 1, // Base unit is %w/v (g/100mL)
    'mg_ml': 10,       // 1% w/v = 1g/100mL = 1000mg/100mL = 10mg/mL
    'percent_v_v': 1, // Base unit is %v/v (mL/100mL)
    'ml_ml': 0.01,     // 1% v/v = 1mL/100mL = 0.01mL/mL
  }
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
  },
  concentration: {
    'percent_w_v': '% w/v',
    'mg_ml': 'mg/mL',
    'percent_v_v': '% v/v',
    'ml_ml': 'mL/mL',
  }
};

type UnitCategory = 'mass' | 'weight' | 'volume' | 'temperature' | 'concentration';

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
    if (newUnits.length > 1) {
      setToUnit(newUnits[1]);
    } else {
      setToUnit(newUnits[0]);
    }
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

    if (fromUnit === toUnit) return inputValue;

    if (category === 'temperature') {
        let celsiusValue: number;
        if (fromUnit === 'C') celsiusValue = value;
        else if (fromUnit === 'F') celsiusValue = (value - 32) * 5/9;
        else celsiusValue = value - 273.15; // Kelvin

        if (toUnit === 'C') return Number(celsiusValue.toPrecision(10)).toString();
        if (toUnit === 'F') return Number(((celsiusValue * 9/5) + 32).toPrecision(10)).toString();
        if (toUnit === 'K') return Number((celsiusValue + 273.15).toPrecision(10)).toString();
        return '';
    } 
    
    const factors = conversionFactors[category];
    if (!factors) return '';

    // Handle special cases for concentration to prevent invalid conversions
    if (category === 'concentration') {
        const fromIsWeightBased = fromUnit === 'percent_w_v' || fromUnit === 'mg_ml';
        const toIsWeightBased = toUnit === 'percent_w_v' || toUnit === 'mg_ml';
        const fromIsVolumeBased = fromUnit === 'percent_v_v' || fromUnit === 'ml_ml';
        const toIsVolumeBased = toUnit === 'percent_v_v' || toUnit === 'ml_ml';

        if ((fromIsWeightBased && toIsVolumeBased) || (fromIsVolumeBased && toIsWeightBased)) {
            return 'N/A';
        }
    }
    
    const fromFactor = factors[fromUnit];
    const toFactor = factors[toUnit];

    if (!fromFactor || !toFactor) return '';

    const baseValue = value / fromFactor;
    const result = baseValue * toFactor;
    return Number(result.toPrecision(10)).toString();

  }, [inputValue, fromUnit, toUnit, category]);

  const calculationExplanation = useMemo(() => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return 'Invalid input value.';
    if (convertedValue === 'N/A') return 'This conversion is not directly supported as it mixes weight-based and volume-based concentrations without knowing the density of the solution.';
    
    if (category === 'temperature') {
        if (fromUnit === 'F' && toUnit === 'C') return `Formula: (°F - 32) × 5/9 = °C\nCalculation: (${value} - 32) × 5/9 = ${convertedValue} °C`;
        if (fromUnit === 'C' && toUnit === 'F') return `Formula: (°C × 9/5) + 32 = °F\nCalculation: (${value} × 9/5) + 32 = ${convertedValue} °F`;
        if (fromUnit === 'C' && toUnit === 'K') return `Formula: °C + 273.15 = K\nCalculation: ${value} + 273.15 = ${convertedValue} K`;
        if (fromUnit === 'K' && toUnit === 'C') return `Formula: K - 273.15 = °C\nCalculation: ${value} - 273.15 = ${convertedValue} °C`;
        return 'Select different temperature units to see the calculation.';
    }

    if (category === 'concentration') {
        if (fromUnit === 'percent_w_v' && toUnit === 'mg_ml') return `Definition: % w/v = g / 100 mL\nCalculation: ${value} g/100mL = ${value*1000} mg/100mL = ${convertedValue} mg/mL`;
        if (fromUnit === 'mg_ml' && toUnit === 'percent_w_v') return `Definition: % w/v = g / 100 mL\nCalculation: ${value} mg/mL = ${value/1000} g/mL = ${value/10} g/100mL = ${convertedValue} % w/v`;
        if (fromUnit === 'percent_v_v' && toUnit === 'ml_ml') return `Definition: % v/v = mL / 100 mL\nCalculation: ${value} mL/100mL = ${convertedValue} mL/mL`;
        if (fromUnit === 'ml_ml' && toUnit === 'percent_v_v') return `Definition: % v/v = mL / 100 mL\nCalculation: ${value} mL/mL = ${value*100} mL/100mL = ${convertedValue} % v/v`;
    }

    const factors = conversionFactors[category];
    if (!factors) return 'No conversion factors available for this category.';

    const fromFactor = factors[fromUnit];
    const toFactor = factors[toUnit];
    
    if (fromFactor > toFactor) { // e.g. g to mg
      const factor = fromFactor / toFactor;
      return `Formula: 1 ${fromUnit} = ${factor} ${toUnit}\nCalculation: ${value} ${fromUnit} × ${factor} = ${convertedValue} ${toUnit}`;
    } else { // e.g. mg to g
      const factor = toFactor / fromFactor;
      return `Formula: 1 ${toUnit} = ${factor} ${fromUnit}\nCalculation: ${value} ${fromUnit} ÷ ${factor} = ${convertedValue} ${toUnit}`;
    }
  }, [inputValue, fromUnit, toUnit, category, convertedValue]);


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
              <SelectItem value="concentration">Concentration</SelectItem>
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
       <CardFooter>
          <Accordion type="single" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ChevronsDown className="h-4 w-4" />
                  Show Calculation
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap font-mono text-sm">
                  {calculationExplanation}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
       </CardFooter>
    </Card>
  );
}

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MagneticFieldSimulation = () => {
  const [magnetStrength, setMagnetStrength] = useState(1000); // in Gauss
  const [distance, setDistance] = useState(5); // in cm
  const [fieldData, setFieldData] = useState([]);

  // Constants
  const MU0 = 4 * Math.PI * 1e-7; // magnetic permeability of free space

  // Calculate magnetic field strength at a given distance (using simplified dipole model)
  const calculateField = (distance, strength) => {
    // Convert distance from cm to meters
    const distanceM = distance / 100;
    // B = (μ0 * m) / (4π * r^3) where m is magnetic moment
    return (MU0 * strength * 1e-4) / (4 * Math.PI * Math.pow(distanceM, 3));
  };

  // Generate field data for the graph
  useEffect(() => {
    const distances = Array.from({ length: 50 }, (_, i) => (i + 1) * 0.5);
    const data = distances.map(d => ({
      distance: d,
      fieldStrength: calculateField(d, magnetStrength)
    }));
    setFieldData(data);
  }, [magnetStrength]);

  // Calculate current field strength at selected distance
  const currentField = calculateField(distance, magnetStrength);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Magnetic Field Induction Simulator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Magnet Strength (Gauss): {magnetStrength}
            </label>
            <Slider
              value={[magnetStrength]}
              onValueChange={(value) => setMagnetStrength(value[0])}
              min={100}
              max={5000}
              step={100}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Distance (cm): {distance}
            </label>
            <Slider
              value={[distance]}
              onValueChange={(value) => setDistance(value[0])}
              min={0.5}
              max={25}
              step={0.5}
              className="w-full"
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Current Field Strength</h3>
            <p className="text-xl">
              {currentField.toExponential(3)} Tesla
            </p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer>
            <LineChart data={fieldData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="distance" 
                label={{ value: 'Distance (cm)', position: 'bottom' }} 
              />
              <YAxis 
                label={{ 
                  value: 'Magnetic Field (Tesla)', 
                  angle: -90, 
                  position: 'insideLeft' 
                }}
                tickFormatter={(value) => value.toExponential(1)}
              />
              <Tooltip 
                formatter={(value) => [
                  value.toExponential(3) + ' Tesla',
                  'Field Strength'
                ]}
                labelFormatter={(label) => `Distance: ${label} cm`}
              />
              <Line 
                type="monotone" 
                dataKey="fieldStrength" 
                stroke="#2563eb" 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="text-sm text-gray-600">
          <p>This simulation uses a simplified dipole model of magnetic field strength:</p>
          <p>B = (μ₀ * m) / (4π * r³)</p>
          <p>where:</p>
          <ul className="list-disc pl-6">
            <li>B is the magnetic field strength in Tesla</li>
            <li>μ₀ is the magnetic permeability of free space</li>
            <li>m is the magnetic moment (derived from magnet strength)</li>
            <li>r is the distance from the magnet in meters</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MagneticFieldSimulation;

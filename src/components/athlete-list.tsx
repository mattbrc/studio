"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { UserCard } from "~/components/user-card";

interface Athlete {
  id: string;
  name: string;
  sport: string;
  state: string;
  imageUrl: string;
}

const mockAthletes: Athlete[] = [
  {
    id: "1",
    name: "John Doe",
    sport: "Basketball",
    state: "CA",
    imageUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Jane Smith",
    sport: "Soccer",
    state: "NY",
    imageUrl: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Mike Johnson",
    sport: "Swimming",
    state: "FL",
    imageUrl: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "4",
    name: "Emily Brown",
    sport: "Tennis",
    state: "TX",
    imageUrl: "https://i.pravatar.cc/150?img=4",
  },
];

export function AthleteList() {
  const [selectedState, setSelectedState] = useState<string | undefined>(
    undefined,
  );

  const filteredAthletes = selectedState
    ? mockAthletes.filter((athlete) => athlete.state === selectedState)
    : mockAthletes;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Latest Athletes</CardTitle>
          <Select onValueChange={(value) => setSelectedState(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="NY">New York</SelectItem>
              <SelectItem value="FL">Florida</SelectItem>
              <SelectItem value="TX">Texas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAthletes.map((athlete) => (
            <Card key={athlete.id} className="overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{athlete.name}</h3>
                <p className="text-sm text-gray-500">{athlete.sport}</p>
                <p className="text-sm text-gray-500">{athlete.state}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredAthletes.length === 0 && (
          <p className="text-center text-gray-500">No athletes found.</p>
        )}
      </CardContent>
    </Card>
  );
}

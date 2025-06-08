"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranzactii, useAdaugaTranzactie } from "@/hooks/useApi";
import GestiuneTranzactii from "@/components/GestiuneTranzactii";

interface TranzactieNoua {
  descriere: string;
  suma: number;
  categorie: string;
}

const TranzactiiPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tranzactieNoua, setTranzactieNoua] = useState<TranzactieNoua>({
    descriere: "",
    suma: 0,
    categorie: "",
  });

  const { mutate: adaugaTranzactie, isPending } = useAdaugaTranzactie();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tranzactieNoua.descriere || !tranzactieNoua.suma || !tranzactieNoua.categorie) {
      return;
    }

    adaugaTranzactie(tranzactieNoua, {
      onSuccess: () => {
        setIsOpen(false);
        setTranzactieNoua({
          descriere: "",
          suma: 0,
          categorie: "",
        });
      },
      onError: (error) => {
        console.error("Eroare la adăugarea tranzacției:", error);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestiune Tranzacții</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Adaugă Tranzacție</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adaugă Tranzacție Nouă</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Descriere
                </label>
                <Input
                  value={tranzactieNoua.descriere}
                  onChange={(e) =>
                    setTranzactieNoua((prev) => ({
                      ...prev,
                      descriere: e.target.value,
                    }))
                  }
                  placeholder="Descrierea tranzacției"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Sumă (RON)
                </label>
                <Input
                  type="number"
                  value={tranzactieNoua.suma || ""}
                  onChange={(e) =>
                    setTranzactieNoua((prev) => ({
                      ...prev,
                      suma: Number(e.target.value),
                    }))
                  }
                  placeholder="Suma tranzacției"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Categorie
                </label>
                <Select
                  value={tranzactieNoua.categorie}
                  onValueChange={(value) =>
                    setTranzactieNoua((prev) => ({
                      ...prev,
                      categorie: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Utilități">Utilități</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Alimentație">Alimentație</SelectItem>
                    <SelectItem value="Divertisment">Divertisment</SelectItem>
                    <SelectItem value="Cumpărături">Cumpărături</SelectItem>
                    <SelectItem value="Altele">Altele</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Anulează
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Se adaugă..." : "Adaugă"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <GestiuneTranzactii />
    </div>
  );
};

export default TranzactiiPage;

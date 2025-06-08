"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranzactii, useAdaugaTranzactie } from "@/hooks/useApi";

interface Tranzactie {
  id: number;
  data: string;
  tip: string;
  descriere: string;
  suma: number;
  categorie: string;
}

const categorii = ["Toate", "Utilități", "Venit", "Cumpărături", "Alimentație", "Transport"];

const GestiuneTranzactii = () => {
  const [filtruCategorie, setFiltruCategorie] = useState<string>("");
  const [cautare, setCautare] = useState<string>("");
  const [nouaDescriere, setNouaDescriere] = useState("");
  const [nouaSuma, setNouaSuma] = useState("");
  const [nouaCategorie, setNouaCategorie] = useState("");
  const [dialogDeschis, setDialogDeschis] = useState(false);

  const { data: tranzactiiData, isLoading, error } = useTranzactii();
  const adaugaTranzactieMutation = useAdaugaTranzactie();

  const adaugaTranzactie = async () => {
    if (!nouaDescriere || !nouaSuma || !nouaCategorie) {
      return;
    }

    adaugaTranzactieMutation.mutate({
      descriere: nouaDescriere,
      suma: parseFloat(nouaSuma),
      categorie: nouaCategorie,
    }, {
      onSuccess: () => {
        setNouaDescriere("");
        setNouaSuma("");
        setNouaCategorie("");
        setDialogDeschis(false);
      },
      onError: (error) => {
        console.error('Eroare la adăugarea tranzacției:', error);
      }
    });
  };

  const resetFormular = () => {
    setNouaDescriere("");
    setNouaSuma("");
    setNouaCategorie("");
    setDialogDeschis(false);
  };
  const tranzactii: Tranzactie[] = tranzactiiData?.data || [];

  const tranzactiiFiltrate: Tranzactie[] = tranzactii.filter((tranzactie: Tranzactie) => {
    const potrivireCategorie = filtruCategorie === "" || filtruCategorie === "Toate" || tranzactie.categorie === filtruCategorie;
    const potrivireCautare = tranzactie.descriere.toLowerCase().includes(cautare.toLowerCase()) ||
                            tranzactie.categorie.toLowerCase().includes(cautare.toLowerCase());
    return potrivireCategorie && potrivireCautare;
  });

  const totalCredit = tranzactiiFiltrate.reduce((sum: number, t: Tranzactie) => t.suma > 0 ? sum + t.suma : sum, 0);
  const totalDebit = tranzactiiFiltrate.reduce((sum: number, t: Tranzactie) => t.suma < 0 ? sum + Math.abs(t.suma) : sum, 0);
  const sold = totalCredit - totalDebit;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">Se încarcă tranzacțiile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-red-500">Eroare la încărcarea tranzacțiilor. Vă rugăm încercați din nou.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Încasări</h3>
          <p className="text-2xl font-semibold text-green-600">{totalCredit} RON</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Plăți</h3>
          <p className="text-2xl font-semibold text-red-600">{totalDebit} RON</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Sold</h3>
          <p className={`text-2xl font-semibold ${sold >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {sold} RON
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Caută tranzacții..."
              value={cautare}
              onChange={(e) => setCautare(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={filtruCategorie} onValueChange={setFiltruCategorie}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selectează categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorii.map((categorie) => (
                  <SelectItem key={categorie} value={categorie}>
                    {categorie}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={dialogDeschis} onOpenChange={setDialogDeschis}>
              <DialogTrigger asChild>
                <Button>Adaugă Tranzacție</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adaugă o nouă tranzacție</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Descriere tranzacție"
                      value={nouaDescriere}
                      onChange={(e) => setNouaDescriere(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Sumă (folosiți - pentru cheltuieli)"
                      value={nouaSuma}
                      onChange={(e) => setNouaSuma(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Select value={nouaCategorie} onValueChange={setNouaCategorie}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selectează categoria" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="z-50">
                        {categorii.slice(1).map((categorie) => (
                          <SelectItem key={categorie} value={categorie}>
                            {categorie}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={resetFormular}>
                    Anulează
                  </Button>
                  <Button 
                    onClick={adaugaTranzactie} 
                    disabled={adaugaTranzactieMutation.isPending || !nouaDescriere || !nouaSuma || !nouaCategorie}
                  >
                    {adaugaTranzactieMutation.isPending ? "Se adaugă..." : "Adaugă"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline">Export CSV</Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descriere</TableHead>
                <TableHead>Categorie</TableHead>
                <TableHead className="text-right">Sumă</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tranzactiiFiltrate.map((tranzactie) => (
                <TableRow key={tranzactie.id}>
                  <TableCell>{new Date(tranzactie.data).toLocaleDateString('ro-RO')}</TableCell>
                  <TableCell>{tranzactie.descriere}</TableCell>
                  <TableCell>{tranzactie.categorie}</TableCell>
                  <TableCell className={`text-right ${
                    tranzactie.suma >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tranzactie.suma} RON
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default GestiuneTranzactii;

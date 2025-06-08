"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          Bine ați venit la BT Go
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Gestiune Tranzacții</h2>
            <p className="text-muted-foreground mb-4">
              Gestionați tranzacțiile dvs. financiare într-un mod simplu și eficient.
            </p>
            <Link href="/tranzactii">
              <Button className="w-full">Accesați Tranzacții</Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Buget Personal</h2>
            <p className="text-muted-foreground mb-4">
              Planificați și urmăriți bugetul dvs. personal cu instrumente avansate.
            </p>
            <Link href="/buget">
              <Button className="w-full" variant="outline">
                Accesați Buget
              </Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Asistent Virtual</h2>
            <p className="text-muted-foreground mb-4">
              Primiți sfaturi și asistență personalizată pentru gestionarea finanțelor.
            </p>
            <Link href="/asistent">
              <Button className="w-full" variant="outline">
                Consultați Asistentul
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

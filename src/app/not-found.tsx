import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg border-none bg-muted">
        <CardHeader className="flex flex-col items-center gap-2">
          <Image
            src="/logo-icon.svg"
            width={48}
            height={48}
            alt="Basura Logo"
            className="mb-2"
          />
          <CardTitle className="text-2xl font-bold text-center text-foreground">
            404 - Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-muted-foreground text-center mb-6">
            Sorry, the page you are looking for does not exist or has been
            moved.
            <br />
            Please check the URL or return to the homepage.
          </p>
          <a href="/" className="w-full">
            <Button variant="default" size="lg" className="w-full">
              Go to Dashboard
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

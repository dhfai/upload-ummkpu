

import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { HardDrive } from "lucide-react";
import Image from "next/image";

const Navbar = async () => {
    return (
        <>
          <header className="px-4 h-14 sticky top-0 inset-x-0 w-full bg-foreground/40 backdrop-blur-lg z-50">
              <div className="flex items-center justify-between h-full">
                <div className="flex items-start">
                  <Link href="/" className="flex items-center gap-2">
                    <Image src="/icons/icon-app.png" width={24} height={24} alt="KPU-DATA" />
                    <span className="text-lg font-medium">KPU-DATA</span>
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/" className={`${buttonVariants({variant: 'outline', size: "sm",})} bg-foreground hover:bg-background`}>
                        Home
                    </Link>
                    <Link href="/kabupaten" className={`${buttonVariants({variant: 'outline', size: "sm",})} bg-foreground hover:bg-background`}>
                        Cek Data
                    </Link>
                </div>
              </div>
          </header>
        </>
      );
    };

export default Navbar

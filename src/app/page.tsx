import LoginUI from "@/components/login";
import { LogoUI } from "@/components/logo";
import { SearchUI } from "@/components/search";
import { ThemeToggleUI } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    ArrowUpRightFromSquare,
    ArrowUpRightIcon,
    HeartIcon,
    MenuIcon,
} from "lucide-react";
import * as motion from "motion/react-client";
import Image from "next/image";

export default function Home() {
    return (
        <main className="flex flex-col w-full min-h-dvh h-full">
            <motion.nav
                className="max-w-5xl w-full mx-auto p-3 px-6 flex justify-between items-center relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex gap-4 items-center">
                    <Sheet>
                        <SheetTrigger className="md:hidden mb-1">
                            <MenuIcon />
                        </SheetTrigger>
                        <SheetContent side="left" className="w-xs">
                            <SheetHeader>
                                <SheetTitle>
                                    <LogoUI />
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 px-4">
                                <NavButtonsUI />
                            </div>
                        </SheetContent>
                    </Sheet>
                    <LogoUI />
                </div>
                <div className="flex gap-2">
                    <NavButtonsUI commonClassName="hidden md:flex" />
                    <ThemeToggleUI />
                    <LoginUI />
                </div>
            </motion.nav>

            <SearchUI />

            <div className="text-center px-4 py-20 text-muted-foreground flex items-center justify-center">
                Built with 💖 by
                <a
                    href="https://shehryar.ae"
                    target="_blank"
                    className="underline flex items-center justify-center gap-1 font-semibold mx-1"
                >
                    Shehryar{" "}
                </a>
            </div>

            <Image
                className="fixed bottom-0 left-0 w-24 sm:w-34 md:w-52 lg:w-xs -scale-x-100 -z-10"
                src="/images/blob-to.png"
                width={419}
                height={603}
                alt=""
            />
            <Image
                className="fixed bottom-0 right-0 w-24 sm:w-34 md:w-52 lg:w-xs -z-10"
                src="/images/blob-bottom.png"
                width={478}
                height={489}
                alt=""
            />
        </main>
    );
}

type NavButtonsUIProps = {
    commonClassName?: string;
};
function NavButtonsUI({ commonClassName = "" }: NavButtonsUIProps) {
    return (
        <>
            <Button
                variant="secondary"
                className={`font-bold gap-1 ${commonClassName}`}
                asChild
            >
                <a
                    href="https://github.com/HanaDigital/grev"
                    target="_blank"
                    rel="noreferrer"
                >
                    <span className="text-muted-foreground">Star on</span>
                    Github
                </a>
            </Button>
            <Button
                variant="secondary"
                className={`font-bold gap-1 ${commonClassName}`}
                asChild
            >
                <a
                    href="https://github.com/HanaDigital/grev/issues/new"
                    target="_blank"
                    rel="noreferrer"
                >
                    <span className="text-muted-foreground">Report a</span>
                    Bug
                </a>
            </Button>
            <Button className={`font-bold ${commonClassName}`} asChild>
                <a
                    href="https://github.com/sponsors/HanaDigital"
                    target="_blank"
                    rel="noreferrer"
                >
                    <HeartIcon className="fill-white" />
                    Buy me a Coffee
                </a>
            </Button>
        </>
    );
}

import LoginUI from "@/components/login";
import { LogoUI } from "@/components/logo";
import { SearchUI } from "@/components/search";
import { SearchInputUI } from "@/components/search-input";
import { SearchResultsUI } from "@/components/search-results";
import { ThemeToggleUI } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import * as motion from "motion/react-client";
import Image from "next/image";

export default function Home() {
    return (
        <main className="flex flex-col w-full min-h-dvh h-full">
            <motion.nav
                className="max-w-5xl w-full mx-auto p-3 flex justify-between items-center relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <LogoUI />
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        className="font-bold gap-1"
                        asChild
                    >
                        <a
                            href="https://github.com/HanaDigital/grev"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="text-muted-foreground">
                                Star on
                            </span>
                            Github
                        </a>
                    </Button>
                    <Button
                        variant="secondary"
                        className="font-bold gap-1"
                        asChild
                    >
                        <a
                            href="https://github.com/HanaDigital/grev/issues/new"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="text-muted-foreground">
                                Report a
                            </span>
                            Bug
                        </a>
                    </Button>
                    <Button className="font-bold" asChild>
                        <a
                            href="https://github.com/sponsors/HanaDigital"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <HeartIcon className="fill-white" />
                            Buy me a Coffee
                        </a>
                    </Button>
                    <ThemeToggleUI />
                    <LoginUI />
                </div>
            </motion.nav>

            <SearchUI />

            <Image
                className="fixed bottom-0 left-0 w-xs -scale-x-100 -z-10"
                src="/images/blob-to.png"
                width={419}
                height={603}
                alt=""
            />
            <Image
                className="fixed bottom-0 right-0 w-xs -z-10"
                src="/images/blob-bottom.png"
                width={478}
                height={489}
                alt=""
            />
        </main>
    );
}

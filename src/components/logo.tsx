"use client";

import { type Variants } from "motion/react";
import { motion } from "motion/react";

const logoVariants: Variants = {
    initial: {
        opacity: 0,
        width: 0,
    },
    whileHover: {
        opacity: 1,
        width: "auto",
        marginRight: "0.25rem",
    },
};

const logoRELEASEVariants: Variants = {
    initial: {
        opacity: 0,
        width: 0,
        color: "oklch(75% 0.16 163)",
    },
    whileHover: {
        opacity: 1,
        width: "5.87rem",
        color: "white",
        marginRight: "0.25rem",
    },
};

const logoREVariants: Variants = {
    initial: {
        opacity: 1,
    },
    whileHover: {
        opacity: 0,
    },
};

const logoLEASEVariants: Variants = {
    initial: {
        width: 0,
    },
    whileHover: {
        width: "auto",
        marginRight: "0.25rem",
    },
};

export function LogoUI() {
    return (
        <motion.div
            className="text-3xl font-medium flex cursor-default font-teko tracking-wide text-secondary-foreground"
            initial="initial"
            whileHover="whileHover"
        >
            <span aria-hidden="true">G</span>
            <motion.div
                className="overflow-hidden"
                variants={logoVariants}
                aria-hidden="true"
            >
                ithub
            </motion.div>
            <div className="text-primary relative" aria-hidden="true">
                <motion.span variants={logoREVariants}>RE</motion.span>
                <motion.div
                    variants={logoRELEASEVariants}
                    className="absolute top-0 -left-1 bg-primary max-h-8 px-1"
                >
                    <span>RELEASE</span>
                </motion.div>
            </div>
            <motion.div
                className="overflow-hidden text-primary opacity-0"
                variants={logoLEASEVariants}
                aria-hidden="true"
            >
                LEASE
            </motion.div>
            <span aria-hidden="true">V</span>
            <motion.div
                className="overflow-hidden"
                variants={logoVariants}
                aria-hidden="true"
            >
                iewer
            </motion.div>
            <span className="sr-only">Github Release Viewer</span>
        </motion.div>
    );
}

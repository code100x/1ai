"use client";
import React from "react";
import { Check, Star } from "@phosphor-icons/react";
import ScrollReveal from "../components/ScrollReveal";
import PricingButton from "@/components/ui/pricing-button";
import { PricingCards } from "@/components/ui/pricing-card";
import { tiers } from "@/constants/data";
import { Badge } from "@/components/ui/badge";

const PricingSection: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6">
      <Badge>Features</Badge>
      <div className="mt-4 text-center">
        <h2 className="text-4xl font-semibold text-balance lg:text-5xl">
          Simple pricing
        </h2>
        <p className="mt-2">
          These are our most simple and affordable pricing for thiss application
        </p>
      </div>

      <PricingCards tiers={tiers} />
    </div>
  );
};

export default PricingSection;

import { useEffect, useState, type ReactNode } from "react";
import parse, { Element } from "html-react-parser";
import ActivitySection from "@/components/activity-section";
import portfolioBodyUrl from "./portfolio-body.html?url";

export default function App() {
  const [portfolio, setPortfolio] = useState<ReactNode>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;

    async function loadPortfolio() {
      try {
        const response = await fetch(portfolioBodyUrl);
        if (!response.ok) {
          throw new Error(
            `Portfolio markup failed to load (${response.status}).`,
          );
        }
        const markup = await response.text();
        const rendered = parse(markup, {
          replace(node) {
            if (
              node instanceof Element &&
              node.attribs["data-react-island"] === "activity"
            ) {
              return <ActivitySection />;
            }
            return undefined;
          },
        });
        if (!cancelled) setPortfolio(rendered);
      } catch (reason) {
        if (cancelled) return;
        setError(
          reason instanceof Error
            ? reason.message
            : "Portfolio markup could not be loaded.",
        );
      }
    }

    void loadPortfolio();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!portfolio) return;
    const backToTop = document.getElementById("back-to-top");
    if (!backToTop) return;

    const updateVisibility = () => {
      backToTop.classList.toggle("show", window.scrollY > 1600);
    };

    window.addEventListener("scroll", updateVisibility);
    updateVisibility();

    return () => window.removeEventListener("scroll", updateVisibility);
  }, [portfolio]);

  if (error) {
    return (
      <div role="alert" className="p-6 text-white">
        {error}
      </div>
    );
  }

  return <>{portfolio}</>;
}

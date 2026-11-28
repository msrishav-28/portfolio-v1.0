import { createElement, useEffect, useMemo } from "react";
import parse, {
  attributesToProps,
  domToReact,
  Element as HtmlElement,
  type DOMNode,
  type HTMLReactParserOptions,
} from "html-react-parser";

const parserOptions: HTMLReactParserOptions = {
  replace(node) {
    if (node instanceof HtmlElement && node.attribs.style !== undefined) {
      return createElement(
        node.name,
        {
          ...attributesToProps(node.attribs),
          ref: (element: Element | null) => {
            element?.setAttribute("style", node.attribs.style);
          },
        },
        domToReact(node.children as DOMNode[], parserOptions),
      );
    }
    return undefined;
  },
};

export default function App({ markup }: { markup: string }) {
  const portfolio = useMemo(() => parse(markup, parserOptions), [markup]);

  useEffect(() => {
    const backToTop = document.getElementById("back-to-top");
    if (!backToTop) return;

    const updateVisibility = () => {
      if (window.scrollY > 1600) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    };

    window.addEventListener("scroll", updateVisibility);
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return <>{portfolio}</>;
}

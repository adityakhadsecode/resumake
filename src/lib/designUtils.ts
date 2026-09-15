import { ResumeDesign, FontFamily, SpacingDensity, FontScale, FONT_OPTIONS } from "@/types/template";

export function getFontFamilyCss(font: FontFamily): string {
  const found = FONT_OPTIONS.find((f) => f.id === font);
  return found ? found.fontCss : "Georgia, 'Times New Roman', Times, serif";
}

export function getDensityConfig(density: SpacingDensity) {
  switch (density) {
    case "compact":
      return {
        sheetPadding: "32px 30px",
        sectionMargin: "10px",
        itemMargin: "8px",
        lineHeight: "1.38",
        ruleMargin: "8px",
        bulletMargin: "2px",
      };
    case "spacious":
      return {
        sheetPadding: "56px 50px",
        sectionMargin: "20px",
        itemMargin: "16px",
        lineHeight: "1.65",
        ruleMargin: "16px",
        bulletMargin: "6px",
      };
    case "normal":
    default:
      return {
        sheetPadding: "48px 44px",
        sectionMargin: "14px",
        itemMargin: "12px",
        lineHeight: "1.52",
        ruleMargin: "12px",
        bulletMargin: "3px",
      };
  }
}

export function getFontScaleConfig(scale: FontScale) {
  switch (scale) {
    case "small":
      return {
        nameSize: "23px",
        titleSize: "13px",
        headingSize: "11px",
        bodySize: "12px",
        smallSize: "10.5px",
      };
    case "large":
      return {
        nameSize: "29px",
        titleSize: "16px",
        headingSize: "13.5px",
        bodySize: "13.5px",
        smallSize: "12px",
      };
    case "normal":
    default:
      return {
        nameSize: "26px",
        titleSize: "14.5px",
        headingSize: "12px",
        bodySize: "12.5px",
        smallSize: "11px",
      };
  }
}

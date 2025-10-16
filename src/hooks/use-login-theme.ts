import { useColorScheme } from "@/src/hooks/use-color-scheme.web";

export const useLoginTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const styles = {
    screenBg: isDark ? "bg-screenDark" : "bg-screenLight",
    textColor: isDark ? "text-textPrimaryDark" : "text-textPrimaryLight",
    secondaryTextColor: isDark
      ? "text-textSecondaryDark"
      : "text-textSecondaryLight",
    inputBg: isDark ? "bg-cardDark" : "bg-cardLight",
    inputBorder: isDark ? "border-slate-600" : "border-slate-300",
    placeholderColor: isDark ? "#9ca3af" : "#64748b",
    buttonBg: isDark ? "bg-button-dark" : "bg-button-light",
  };

  return {
    isDark,
    styles,
  };
};

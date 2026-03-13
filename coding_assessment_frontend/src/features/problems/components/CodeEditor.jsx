import { useMemo } from "react";
import Editor from "@monaco-editor/react";
import { getBoilerplate } from "../utils/boilerplate.js";

export default function CodeEditor({ languageSlug, value, onChange, className, bare }) {
  const defaultValue = useMemo(
    () => getBoilerplate(languageSlug),
    [languageSlug]
  );
  const wrapperClass = bare
    ? `min-h-[200px] overflow-hidden ${className || "h-[360px] md:h-[400px]"}`
    : `min-h-[200px] overflow-hidden border border-slate-800 rounded-lg ${className || "h-[360px] md:h-[400px]"}`;

  return (
    <div className={wrapperClass}>
      <Editor
        theme="vs-dark"
        defaultLanguage={languageSlug || "plaintext"}
        language={languageSlug || "plaintext"}
        value={value}
        defaultValue={defaultValue}
        onChange={(val) => onChange(val ?? "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
      />
    </div>
  );
}

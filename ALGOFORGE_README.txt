================================================================================
  AlgoForge Project - Open in Visual Studio Code
================================================================================

PROJECT ROOT FOLDER (exact path):
  C:\Users\HP\.vscode

PROJECT STRUCTURE:
  C:\Users\HP\.vscode\
  ├── AlgoForge\
  │   ├── code_assessment_platform\     (Django backend)
  │   └── coding_assessment_frontend\   (React frontend)
  ├── algoforge.code-workspace      (VS Code workspace)
  ├── start_algoforge.bat           (Start backend + frontend + browser)
  ├── OPEN_ALGOFORGE_IN_VSCODE.bat  (Open project in VS Code)
  └── ALGOFORGE_README.txt          (This file)

  To reorganize (first-time only): Close Cursor, then run MOVE_ALGOFORGE_FOLDERS.bat

--------------------------------------------------------------------------------
HOW TO OPEN IN VISUAL STUDIO CODE (one click)
--------------------------------------------------------------------------------

Option 1 - Double-click the workspace file:
  → Double-click: algoforge.code-workspace
  → VS Code opens with both Backend and Frontend folders in the sidebar

Option 2 - Use the batch file:
  → Double-click: OPEN_ALGOFORGE_IN_VSCODE.bat
  → Requires: "code" command in PATH (install from VS Code via Ctrl+Shift+P →
              "Shell Command: Install 'code' command in PATH")

Option 3 - From VS Code menu:
  → File → Open Workspace from File...
  → Navigate to: C:\Users\HP\.vscode\algoforge.code-workspace
  → Click Open

--------------------------------------------------------------------------------
HOW TO RUN ALGOFORGE
--------------------------------------------------------------------------------

→ Double-click: start_algoforge.bat
  Starts Django backend + React frontend + opens browser at http://localhost:5173

--------------------------------------------------------------------------------

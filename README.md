# TLA
WEB APP
Open the pyRevit CLI (find it in Start Menu as “pyRevit CLI”).

To create your extension locally (say at C:\Users\<your_user>\pyRevitExtensions), run:

bash
Copy
Edit
pyrevit extend library "C:\Users\<your_user>\pyRevitExtensions"
To set this as your dev extension root (so edits appear instantly):

bash
Copy
Edit
pyrevit configs extensions searchpaths add "C:\Users\<your_user>\pyRevitExtensions"
Restart Revit to ensure pyRevit picks up dev extensions.
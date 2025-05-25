import os
import tempfile
from pyrevit import script, forms
from Autodesk.Revit.DB import *
from Autodesk.Revit.UI import *

# -- SETTINGS --
SPECKLE_PUSH_SCRIPT = r"D:\New folder\OneDrive - Cal Poly\Documents\GitHub\TLA\speckle_push.py"  # Update this!
WEBAPP_URL = "https://yourwebapp.com/speckleviewer?stream=35ec9c1d80"

# 1. Find default 3D view (or fallback)
doc = __revit__.ActiveUIDocument.Document
views = FilteredElementCollector(doc).OfClass(View3D).ToElements()
active_3d = next((v for v in views if not v.IsTemplate and v.Name == "{3D}"), None) or \
            next((v for v in views if not v.IsTemplate), None)
if not active_3d:
    forms.alert("No 3D view found.", exitscript=True)

# 2. Export 3D View (use .ifc for wide compatibility, but could use .obj/.fbx as needed)
tempdir = tempfile.gettempdir()
export_path = os.path.join(tempdir, "export_3D.ifc")
ifc_options = IFCExportOptions()
doc.Export(tempdir, "export_3D", ifc_options)

# 3. Call external script to push to Speckle
python_exe = r"C:\Users\nehaa\AppData\Local\Programs\Python\Python312\python.exe"  # Update for your system!
os.system(f'"{python_exe}" "{SPECKLE_PUSH_SCRIPT}" "{export_path}"')

# 4. Open your webapp in browser
os.startfile(WEBAPP_URL)

forms.alert("Model exported, pushed, and web app opened!", exitscript=True)
